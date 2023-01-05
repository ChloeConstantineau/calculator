import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as random from '@pulumi/random';
import * as dotenv from 'dotenv';
dotenv.config();

const config = new pulumi.Config();
const githubRepoMain = config.get('githubRepoMain');

const port = process.env.PORT || 3000;

const imageRepository = new aws.ecr.Repository('calculator', {
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: 'MUTABLE',
});

const githubActionsOidc = new aws.iam.OpenIdConnectProvider(
  'github-actions-oidc',
  {
    clientIdLists: ['sts.amazonaws.com'],
    thumbprintLists: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    url: 'https://token.actions.githubusercontent.com',
  },
);

const ghActionAssumedRoleWithOidc = new aws.iam.Role(
  'github-actions-assumable-role-with-oidc',
  {
    assumeRolePolicy: githubActionsOidc.arn.apply((oidcArn) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Federated: oidcArn,
            },
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringLike: {
                'token.actions.githubusercontent.com:sub': githubRepoMain,
              },
              StringEquals: {
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
              },
            },
          },
        ],
      }),
    ),
  },
  { dependsOn: githubActionsOidc },
);

const ecrGhActionsRolePolicy = new aws.iam.RolePolicy(
  'github-actions-ecr-role-policy',
  {
    role: ghActionAssumedRoleWithOidc.name,
    policy: imageRepository.arn.apply((imageRepoArn) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'GetAuthorizationToken',
            Effect: 'Allow',
            Action: ['ecr:GetAuthorizationToken'],
            Resource: '*',
          },
          {
            Sid: 'AllowPushPull',
            Effect: 'Allow',
            Action: [
              'ecr:BatchGetImage',
              'ecr:BatchCheckLayerAvailability',
              'ecr:CompleteLayerUpload',
              'ecr:GetDownloadUrlForLayer',
              'ecr:InitiateLayerUpload',
              'ecr:PutImage',
              'ecr:UploadLayerPart',
            ],
            Resource: imageRepoArn,
          },
        ],
      }),
    ),
  },
  { dependsOn: [ghActionAssumedRoleWithOidc] },
);

const appRunnerAssumedRole = new aws.iam.Role('apprunner-role', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'build.apprunner.amazonaws.com',
        },
        Effect: 'Allow',
      },
    ],
  },
});

const appRunnerPolicyAttachment = new aws.iam.RolePolicyAttachment(
  'apprunner-policy-attach',
  {
    role: appRunnerAssumedRole.name,
    policyArn:
      'arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess',
  },
  { dependsOn: appRunnerAssumedRole },
);

const appRunnerName = new random.RandomPet('calculator-apprunner');
const appRunner = new aws.apprunner.Service(
  'calculator-apprunner',
  {
    serviceName: pulumi.interpolate`calculator-apprunner-${appRunnerName.id}`,
    sourceConfiguration: {
      authenticationConfiguration: {
        accessRoleArn: appRunnerAssumedRole.arn,
      },
      imageRepository: {
        imageConfiguration: {
          port: port.toString(),
        },
        imageIdentifier: pulumi.interpolate`${imageRepository.repositoryUrl}:latest`,
        imageRepositoryType: 'ECR',
      },
    },
    tags: {
      Name: 'calculator-apprunner-service',
    },
  },
  { dependsOn: [imageRepository, appRunnerPolicyAttachment, appRunnerName] },
);

import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const imageRepository = new aws.ecr.Repository('image-repository', {
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

const assumableRoleWithOidc = new aws.iam.Role(
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
                'token.actions.githubusercontent.com:sub':
                  'repo:ChloeConstantineau/calculator:ref:refs/heads/main',
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

const ecrRolePolicy = new aws.iam.RolePolicy(
  'github-actions-ecr-role-policy',
  {
    role: assumableRoleWithOidc.name,
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
  { dependsOn: [assumableRoleWithOidc, imageRepository] },
);

// const repositoryPolicy = new aws.ecr.RepositoryPolicy('myrepositorypolicy', {
//   repository: repository.id,
//   policy: JSON.stringify({
//     Version: '2012-10-17',
//     Statement: [
//       {
//         Sid: 'new policy',
//         Effect: 'Allow',
//         Principal: '*',
//         Action: [
//           'ecr:GetDownloadUrlForLayer',
//           'ecr:BatchGetImage',
//           'ecr:BatchCheckLayerAvailability',
//           'ecr:PutImage',
//           'ecr:InitiateLayerUpload',
//           'ecr:UploadLayerPart',
//           'ecr:CompleteLayerUpload',
//           'ecr:DescribeRepositories',
//           'ecr:GetRepositoryPolicy',
//           'ecr:ListImages',
//           'ecr:DeleteRepository',
//           'ecr:BatchDeleteImage',
//           'ecr:SetRepositoryPolicy',
//           'ecr:DeleteRepositoryPolicy',
//         ],
//       },
//     ],
//   }),
// });

// const lifecyclePolicy = new aws.ecr.LifecyclePolicy('mylifecyclepolicy', {
//   repository: repository.id,
//   policy: JSON.stringify({
//     rules: [
//       {
//         rulePriority: 1,
//         description: 'Expire images older than 14 days',
//         selection: {
//           tagStatus: 'untagged',
//           countType: 'sinceImagePushed',
//           countUnit: 'days',
//           countNumber: 14,
//         },
//         action: {
//           type: 'expire',
//         },
//       },
//     ],
//   }),
// });

// const example = new aws.apprunner.Service('example', {
//   serviceName: 'example',
//   sourceConfiguration: {
//     autoDeploymentsEnabled: true,
//     imageRepository: {
//       imageConfiguration: {
//         port: '3000',
//       },
//       imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
//       imageRepositoryType: 'ECR_PUBLIC',
//     },
//   },
//   tags: {
//     Name: 'example-apprunner-service',
//   },
// });
# Infra

This folder contains the infra code to deploy the application on AWS.

It creates 3 essentials parts:

1. An Image repository (ECR)
2. An OICD contract between github action and AWS to be able too push the app image from github actions to the AWS ECR
3. An AppRunner instance configured with an image trigger on the ECR.

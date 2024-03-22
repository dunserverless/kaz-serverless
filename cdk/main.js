#!/usr/bin/env node

const cdk = require('aws-cdk-lib')
const { ApiStack } = require('./constructs/api-stack')

// pass value with context flag when you synth or deploy
// cdk deploy --profile sand --context stageName=test
// when you want to destroy you also need to pass the context
// cdk destroy --context stageName=feature-a
const app = new cdk.App()
let stageName = app.node.tryGetContext('stageName')

if (!stageName) {
  console.log('Defaulting stage name to dev')
  stageName = 'KH'
}

new ApiStack(app, `ApiStack-${stageName}`, { stageName })

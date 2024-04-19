#!/usr/bin/env node

const cdk = require('aws-cdk-lib')
const { ApiStack } = require('./constructs/api-stack.js')
const { DatabaseStack } = require('./constructs/database-stack.js')
const { CognitoStack } = require('./constructs/cognito-stack')

// pass value with context flag when you synth or deploy
// cdk deploy --profile sand --context stageName=test
// when you want to destroy you also need to pass the context
// cdk destroy --context stageName=feature-a
const app = new cdk.App()
let stageName = app.node.tryGetContext('stageName')

if (!stageName) {
  console.log('Defaulting stage name to kazza')
  stageName = 'kazza'
}

const dbStack = new DatabaseStack(app, `DatabaseStack-${stageName}`, { stageName })
const cognitoStack = new CognitoStack(app, `CognitoStack-${stageName}`, { stageName })
new ApiStack(app, `ApiStack-${stageName}`, { 
  serviceName: 'workshop-kazza',
  stageName,
  restaurantsTable: dbStack.restaurantsTable,
  cognitoUserPool: cognitoStack.cognitoUserPool,
  webUserPoolClient: cognitoStack.webUserPoolClient,
  serverUserPoolClient: cognitoStack.serverUserPoolClient
})

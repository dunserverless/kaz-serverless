
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb")
const middy = require('@middy/core')
const ssm = require('@middy/ssm')

const dynamodbClient = new DynamoDB()
const dynamodb = DynamoDBDocumentClient.from(dynamodbClient)

const { service_name, ssm_stage_name } = process.env
const tableName = process.env.restaurants_table
const middyCacheEnabled = JSON.parse(process.env.middy_cache_enabled)
const middyCacheExpiry = parseInt(process.env.middy_cache_expiry_milliseconds)

/**
 * 
 * performs a DynamoDB scan against the restaurants_table and returns the first X number of restaurants it finds
 * scans are inefficient but we only have 10 items in the table so it's ok!
 * depends on 2 environment variables
 * 
 */
const getRestaurants = async (count) => {
  console.log(`fetching ${count} restaurants from ${tableName}...`)

  const resp = await dynamodb.send(new ScanCommand({
    TableName: tableName,
    Limit: count,
  }))
  console.log(`found ${resp.Items.length} restaurants`)
  return resp.Items
}

module.exports.handler = middy(async (event, context) => {
  const restaurants = await getRestaurants(context.config.defaultResults)
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }

  return response
}).use(ssm({
  cache: middyCacheEnabled,
  cacheExpiry: middyCacheExpiry,
  setToContext: true,
  fetchData: {
    config: `/${service_name}/${ssm_stage_name}/get-restaurants/config`
  }
}))

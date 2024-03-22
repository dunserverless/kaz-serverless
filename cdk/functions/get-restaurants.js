
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb")
const dynamodbClient = new DynamoDB()
const dynamodb = DynamoDBDocumentClient.from(dynamodbClient)

const defaultResults = parseInt(process.env.default_results)
const tableName = process.env.restaurants_table

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

module.exports.handler = async (event, context) => {  
  const restaurants = await getRestaurants(defaultResults)
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }

  return response
}

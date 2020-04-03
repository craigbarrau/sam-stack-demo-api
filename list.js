import axios from 'axios';
import * as dynamoDbLib from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";
import debug from "./libs/debug-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const result = await dynamoDbLib.call("query", params);

  await axios({
    method  : 'get',
    url     : `https://ph2kc1zl5m.execute-api.us-east-1.amazonaws.com/node12?case=normal`,
  });

  await axios({
    method  : 'post',
    url     : `https://ph2kc1zl5m.execute-api.us-east-1.amazonaws.com/node12?case=normal`,
  });

  // Return the matching list of items in response body
  return result.Items;
});

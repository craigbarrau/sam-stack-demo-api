import axios from 'axios';
import * as dynamoDbLib from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamoDbLib.call("get", params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }

  await axios({
    method  : 'get',
    url     : `https://ph2kc1zl5m.execute-api.us-east-1.amazonaws.com/node12?case=normal`,
  });

  await axios({
    method  : 'post',
    url     : `https://ph2kc1zl5m.execute-api.us-east-1.amazonaws.com/node12?case=normal`,
  });

  // Return the retrieved item
  return result.Item;
});

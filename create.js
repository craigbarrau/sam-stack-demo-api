import * as uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await dynamoDbLib.call("put", params);
  return params.Item;
});

import AWS from "aws-sdk";
const client = new AWS.DynamoDB.DocumentClient();

export default new Proxy(
  {},
  {
    get(target, name) {
      return client[name];
    },
  }
);


import * as uuid from "uuid";
import handler from "./libs/handler-lib";
//import dynamoDb from "./libs/dynamodb-lib";
import AWS from "aws-sdk";


export const main = handler(async (event, context) => {
  AWS.config.update({ region: 'us-east-2' });
  return 'borked';
  const client = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await client.put(params);

  return params.Item;
});

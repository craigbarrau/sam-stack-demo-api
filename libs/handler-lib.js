import * as debug from "./debug-lib";

export default function handler(lambda) {
  return function (event, context) {
    return Promise.resolve()
      // Start debugger
      .then(() => debug.init(event, context))
      // Run the Lambda
      .then(() => lambda(event, context))
      // On success
      .then((responseBody) => [200, responseBody])
      // On failure
      .catch((e) => {
        // Print debug messages
        debug.flush(e);
        return [500, { error: e.message }];
      })
      // Return HTTP response
      .then(([statusCode, body]) => ({
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(body),
      }))
      // Cleanup debugger
      .finally(debug.end);
  };
}


  /*
export default function handler(fn) {
  return (event, context) => {
    debug.init(event, context);

    return fn(event, context)
      .then((responseBody) => [200, responseBody])
      .catch((e) => {
        debug.flush(e);
        return [500, { error: e.message }];
      })
      .then(([statusCode, body]) => { console.log('done with ', statusCode); return {
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(body),
      };
      })
      .finally(debug.end);
  };
}
*/

/*
export default function handler(handler) {
  return async (event, context) => {
    let statusCode = 200;
    let responseBody;

    debug.init(event, context);

    try {
      responseBody = await handler(event, context);
    } catch(e) {
      debug.flush(e);

      statusCode = 500;
      responseBody = { status: false, error: e.message};
    }

    debug.end();

    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(responseBody)
    };
  };
}
*/

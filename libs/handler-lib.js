import * as debug from './debug-lib';

export function wrapper(handler) {
  return (event, context) => {
    debug.init(event, context);

    return handler(event, context)
      .then(responseBody => [ 200, responseBody ])
      .catch(e => {
        console.error(e);
        debug.print();
        return [ 500, { status: false, error: e.message } ];
      })
      .then(([ statusCode, body] ) => ({
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
      }))
      .finally(debug.end);
  };
}

//export function wrapper(handler) {
//  return async (event, context) => {
//    let statusCode = 200;
//    let responseBody;
//
//    debug.init(event, context);
//
//    try {
//      responseBody = await handler(event, context);
//    } catch(e) {
//      // log error
//      console.error(e);
//      debug.print();
//
//      statusCode = 500;
//      responseBody = { status: false, error: e.message};
//    }
//
//    debug.end();
//
//    return {
//      statusCode,
//      headers: {
//        "Access-Control-Allow-Origin": "*",
//        "Access-Control-Allow-Credentials": true
//      },
//      body: JSON.stringify(responseBody)
//    };
//  };
//}
//

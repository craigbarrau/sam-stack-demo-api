import * as debug from './debug-lib';

export default function handler(fn) {
  return (event, context) => {
    debug.init(event, context);

    return fn(event, context)
      .then(responseBody => [ 200, responseBody ])
      .catch(e => {
        debug.flush(e);
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


import * as debug from './debug-lib';

export function wrapper(handler) {
  return async (event, context) => {
    let statusCode = 200;
    let responseBody;

    debug.init(event, context);

    try {
      responseBody = await handler();
    } catch(e) {
      // log error
      console.error(e);
      debug.print();

      statusCode = 500;
      responseBody = { status: false, error: e.message};
    }

    debug.end(event);

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


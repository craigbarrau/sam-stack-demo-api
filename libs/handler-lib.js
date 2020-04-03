import AWS from 'aws-sdk';
import debug from './debug-lib';

// configure AWS logger
AWS.config.logger = debug;

export function wrapper(handler) {
  return async (event, context) => {
    let statusCode = 200;
    let responseBody;
    let timeoutTimer;

    // log api request data
    debug.init();
    debug.log('API event', JSON.stringify({
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
      body: event.body,
    }));

    startTimeoutTimer();
    try {
      responseBody = await handler();
    } catch(e) {
      // log error
      console.error(e);
      debug.print();

      statusCode = 500;
      responseBody = { status: false, error: e.message};
    }

    clearTimeoutTimer();

    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(responseBody)
    };

    function startTimeoutTimer() {
      const timeLeft = context.getRemainingTimeInMillis();
      timeoutTimer = setTimeout(() => {
        if (timer) {
          console.error('Lambda will timeout in 3 seconds');
          debug.print();
        }
      }, timeLeft - 3000);
    }

    function clearTimeoutTimer() {
      clearTimeout(timeoutTimer);
      timeoutTimer = undefined;
    }

  };
}


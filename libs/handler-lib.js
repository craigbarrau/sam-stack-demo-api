import AWS from 'aws-sdk';
import debug from './debug-lib';

export function wrapper(handler) {
  return async (event, context) =>
    timeoutWrapper(context, () =>
      responseWrapper(() =>
        debugWrapper(event, () =>
          handler(event, context)
        )
      )
    );
}

async function timeoutWrapper(context, cb) {
  // start timer
  const timeLeft = context.getRemainingTimeInMillis();
  let timer = setTimeout(() => {
    if (timer) {
      console.error('Lambda will timeout in 3 seconds');
      debug.print();
    }
  }, timeLeft - 3000);

  await cb();

  // clear timer
  clearTimeout(timer);
  timer = undefined;
}

async function debugWrapper(event, cb) {
  // configure AWS logger
  AWS.config.logger = debug;

  // log api request data
  debug.init();
  debug.log('API event', JSON.stringify({
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    body: event.body,
  }));

  try {
    await cb();
  } catch(e) {
    console.error(e);
    debug.print();

    throw e;
  }
}

async function responseWrapper(cb) {
  let statusCode = 200;
  let responseBody;

  try {
    responseBody = await cb();
  } catch(e) {
    statusCode = 500;
    responseBody = { status: false, error: e.message};
  }

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(responseBody)
  };
}


import AWS from 'aws-sdk';
import util from 'util';

AWS.config.logger = { log };

let __timeoutTimer;
let __logs;

export function init(event, context) {
  __logs = [];

  // Log api event
  log('API event', JSON.stringify({
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  }));

  // Start timeout timer
  __timeoutTimer = setTimeout(
    () => __timeoutTimer && flush(new Error('Lambda will timeout in 3 seconds')),
    context.getRemainingTimeInMillis() - 3000
  );
}

export function end() {
  // Clear timeout timer
  clearTimeout(__timeoutTimer);
  __timeoutTimer = null;
}

export function log() {
  __logs.push({
    date: new Date(),
    string: util.format.apply(null, arguments)
  });
}

export function flush(e) {
  console.error(e);
  __logs.forEach(({ date, string }) =>
    console.log('DEBUG', date, string)
  );
}


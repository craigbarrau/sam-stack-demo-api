import AWS from 'aws-sdk';
import util from 'util';

AWS.config.logger = this;

let timeoutTimer;
const logs = [];

export function init(event, context) {
  logs.length = 0;

  // Log api event
  log('API event', JSON.stringify({
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    body: event.body,
  }));

  // Start timeout timer
  const timeLeft = context.getRemainingTimeInMillis();
  timeoutTimer = setTimeout(() => {
    if (timeoutTimer) {
      console.error('Lambda will timeout in 3 seconds');
      print();
    }
  }, timeLeft - 3000);
}

export function end() {
  // Clear timeout timer
  clearTimeout(timeoutTimer);
  timeoutTimer = undefined;
}

export function log() {
  const string = util.format.apply(null, arguments);
  logs.push({ date:new Date(), string });
}

export function print() {
  logs.forEach(({ date, string }) =>
    console.log('DEBUG', date, string)
  );
}


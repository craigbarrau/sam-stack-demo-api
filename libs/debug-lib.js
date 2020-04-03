import AWS from "aws-sdk";
import util from "util";

// Log AWS SDK calls
AWS.config.logger = { log: debug };

let __logs;
let __timeoutTimer;

export function init(event, context) {
  __logs = [];

  // Log API event
  debug(
    "API event",
    {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    }
  );

  // Start timeout timer
  __timeoutTimer = setTimeout(
    () => {
  console.log('timer reached');
      __timeoutTimer && flush(new Error("Lambda will timeout in 100 ms")); },
    context.getRemainingTimeInMillis() - 100
  );
}

export function end() {
  console.log('timer canceled');
  // Clear timeout timer
  clearTimeout(__timeoutTimer);
  __timeoutTimer = null;
}

export function flush(e) {
  console.error(e);
  __logs.forEach(({ date, string }) => console.debug(date, string));
}

export default function debug() {
  __logs.push({
    date: new Date(),
    string: util.format.apply(null, arguments),
  });
}


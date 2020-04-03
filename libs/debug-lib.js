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
    JSON.stringify({
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    })
  );

  // Start timeout timer
  __timeoutTimer = setTimeout(
    () => __timeoutTimer && flush(new Error("Lambda will timeout in 100 ms")),
    context.getRemainingTimeInMillis() - 100
  );
}

export function end() {
  // Clear timeout timer
  clearTimeout(__timeoutTimer);
  __timeoutTimer = null;
}

export function flush(e) {
  console.error(e);
  __logs.forEach(({ date, string }) => console.log("DEBUG", date, string));
}

export default function debug() {
  __logs.push({
    date: new Date(),
    string: util.format.apply(null, arguments),
  });
}


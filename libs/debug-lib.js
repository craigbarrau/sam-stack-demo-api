import http from 'http';
import https from 'https';
import url from 'url';
import util from 'util';
import AWS from "aws-sdk";
import { success, failure } from "./response-lib";

AWS.config.logger = { log };
httpLogger(http);
httpLogger(https);

let logs = [];
let timeoutTimer;

export function debugHandler(handler) {
  return async (event, context) => {
    resetLogs();

    // log api request data
    log('API event', JSON.stringify({
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
      body: event.body,
    }));

    // start timeout watcher
    handleStartTimeoutTimer(context);

    let ret;
    try {
      ret = await handler(event, context);
      ret = success(ret);
    } catch(e) {
      console.error(e);
      printLogs();
      ret = failure({ status: false, error: e.message });
    }

    handleClearTimeoutTimer(context);

    return ret;
  };
}

export function log() {
  const string = util.format.apply(null, arguments);
  logs.push({ date:new Date(), string });
}

function resetLogs() {
  logs = [];
}

function printLogs() {
  logs.forEach(({ date, string }) => console.log('DEBUG', date, string));
}

function handleStartTimeoutTimer(context) {
  const timeLeft = context.getRemainingTimeInMillis();
  timeoutTimer = setTimeout(async () => {
    if (timeoutTimer) {
      console.error('Lambda will timeout in 3 seconds');
      printLogs();
    }
  }, timeLeft - 3000);
}

function handleClearTimeoutTimer(context) {
  clearTimeout(timeoutTimer);
  timeoutTimer = undefined;
}

function httpLogger(module) {
  // log request() method
  module.__request = module.request;
  module.request = function captureHTTPsRequest(...args) {
    return captureOutgoingHTTPs(module.__request, ...args);
  };

  // log get() method
  module.__get = module.get;
  module.get = function captureHTTPsGet(...args) {
    return captureOutgoingHTTPs(module.__get, ...args);
  };

  function captureOutgoingHTTPs(baseFunc, ...args) {
    let urlObj;
    let options;
    let callback;

    // handle input format with url
    // ie. https.request(url[, options][, callback])
    if (typeof args[1] === 'object') {
      urlObj = typeof args[0] === 'string' ? url.parse(args[0]) : args[0];
      options = typeof args[1] === 'string' ? url.parse(args[1]) : args[1];
      callback = args[2];
    }
    // handle input format without url
    // ie. https.request(options[, callback])
    else {
      urlObj = undefined;
      options = typeof args[0] === 'string' ? url.parse(args[0]) : args[0];
      callback = args[1];
    }

    const hostname = options.hostname || options.host || urlObj.hostname || urlObj.host || 'Unknown host';
    const method = options.method;
    const path = options.path;
    const startAt = Date.now();
    //    console.log("{ REQUEST:");
    //    console.log(args[0]);
    //    console.log("} ");
    log(`[HTTP req ${method} ${hostname}${path}]`);

    var req = baseFunc(...(urlObj ? [urlObj, options] : [options]), function(res) {
      res.on('end', function() {
        const duration = Date.now() - startAt;
        log(`[HTTP res ${method} ${hostname}${path} ${res.statusCode} ${duration}ms]`);
        //        console.log("{ RESPONSE:");
        //        console.log(res);
        //        console.log("} ");
      });

      if (typeof callback === 'function') {
        callback(res);
      }
    });

    return req;
  }
}


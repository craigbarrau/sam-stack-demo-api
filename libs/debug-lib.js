import util from 'util';

const logs = [];

export function init() {
  logs.length = 0;
}

export function log() {
  const string = util.format.apply(null, arguments);
  logs.push({ date:new Date(), string });
}

export function print() {
  logs.forEach(({ date, string }) => console.log('DEBUG', date, string));
}

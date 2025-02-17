import {Ok, Err} from 'neverthrow';

Ok.prototype.safeRet = function () {
  return [undefined, this.value];
};

Err.prototype.safeRet = function () {
  return [this.error, undefined];
};

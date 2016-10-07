"use strict";
// Taken from github.com/isaacs/json-stringify-safe
function serializer() {
    var stack = [];
    var keys = [];
    var cycleReplacer = function (key, value) {
        if (stack[0] === value) {
            return "[Circular ~]";
        }
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
    };
    return function (key, value) {
        if (stack.length > 0) {
            var thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        }
        else {
            stack.push(value);
        }
        return value;
    };
}
exports.serializer = serializer;
//# sourceMappingURL=safe.util.js.map
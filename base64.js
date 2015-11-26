var buffer = require("bufferpack");


var B64 = "./0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function lshift(num, bits) {
    return num * Math.pow(2,bits);
}

function prepend_zero(s, n) {
    for (var k = 0; k < n; k++) {
        s = "0".concat(s);
    }
    return s;
}

function bor(num1,num2) {
    var res = "";
    var num1_bin = parseInt(num1, 10).toString(2);
    var num2_bin = parseInt(num2, 10).toString(2);
    if(num1_bin.length < num2_bin.length) {
        var tmp = num1_bin;
        num1_bin = num2_bin;
        num2_bin = tmp;
    }

    num2_bin = prepend_zero(num2_bin, num1_bin.length - num2_bin.length);

    for (var n = num1_bin.length-1; n >= 0; n--) {
        if (num1_bin[n] == "1" || num2_bin[n] == "1") {
            res = "1".concat(res);
        } else {
            res = "0".concat(res);
        }
    }
    return parseInt(res, 2);
}

function bc64_encode(s) {
    var curr;
    var res = [];
    var first = 0, last = 8;
    while (true) {
        curr = s.slice(first,last);

        var unpacked = buffer.unpack(">LL", new Buffer(curr));
        if (unpacked == undefined) {
            break;
        }
        var left = unpacked[0];
        var right = unpacked[1];

        for (var n = 0; n < 6; n++) {
            res.push(B64[right & 0x3f]);
            right >>>= 6;
        }

        for (var i = 0; i < 6; i++) {
            res.push(B64[left & 0x3f]);
            left >>>= 6;
        }
        first = last;
        last = first + 8;
    }

    return res.join("");
}

function bc64_decode(s) {
    var curr;
    var res = [];
    s = s.toString().split("");
    while(true) {
        var left = 0, right = 0;

        curr = s.splice(0,6);
        if (typeof curr[0] === 'undefined') {
            break;
        }
        for (var index in curr) {
            right = bor(right, lshift(B64.indexOf(curr[index]), (index*6)));
        }

        curr = s.splice(0,6);

        for (var index in curr) {
            left = bor(left, lshift(B64.indexOf(curr[index]), (index*6)));
        }
        res.push(buffer.pack(">LL", [left, right]).toString("binary"));
    }
    return res.join("");
}

module.exports = {
    bc64_encode: bc64_encode,
    bc64_decode: bc64_decode
}
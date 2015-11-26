var bc64 = require("./base64");
var MCrypt = require("mcrypt").MCrypt;


function generateMcrypt(key) {
    var bc = new MCrypt('blowfish', 'ecb');
    bc.validateKeySize(false);
    bc.open(key);

    return bc;
}

function decrypt_message(msg, key) {
    //Assumes message is blowcrypt base64 encoded
    if (msg.startsWith("+OK ")) {
        msg = msg.slice(4);
    }

    msg = bc64.bc64_decode(msg);
    var bc = generateMcrypt(key);

    var res = "";
    for (var n in msg) {
        res = res.concat(bc.decrypt(msg[n]).toString());
    }
    return res.replace(/\0/g, "");
}

function encrypt_message(msg, key) {
    if (msg.length % 8 != 0) {
        msg.concat(new Array(8 - msg.length % 8).join("\0"));
    }
    var bc = generateMcrypt(key);
    msg = bc.encrypt(msg);

    return "+OK " + bc64.bc64_encode(msg).toString();
}

module.exports = {
    decrypt_msg: decrypt_message,
    encrypt_msg: encrypt_message
};

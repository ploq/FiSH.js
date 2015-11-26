var bc64 = require("./base64");
var crypto = require("crypto");

function decrypt_message(msg, key) {
    //Assumes message is blowcrypt base64 encoded
    if (msg.startsWith("+OK ")) {
        msg = msg.slice(4);
    }

    msg = bc64.bc64_decode(msg);
    var decipher = crypto.createDecipheriv("bf-ecb", key, "");
    decipher.setAutoPadding(false);

    res = "";
    res += decipher.update(msg, "binary", "utf-8")

    res += decipher.final("utf-8");

    return res.replace(/\0/g, "");
}

function encrypt_message(msg, key) {  
    var cipher = crypto.createCipheriv("bf-ecb", key, ""); 
    cipher.setAutoPadding(true);  
    var res = cipher.update(new Buffer(msg));
    cipher.final();  

    return "+OK " + bc64.bc64_encode(res).toString(); }

module.exports = {
    decrypt_msg: decrypt_message,
    encrypt_msg: encrypt_message
};

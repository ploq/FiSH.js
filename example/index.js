var assert = require("assert");

var bc = require("../blowcrypt.js");

var key = "random_test_key";
var msg = "Hello there!";

var encrypted = bc.encrypt_msg(msg, key);
console.log("Encrypted:", encrypted);

var decrypted = bc.decrypt_msg(encrypted, key);
console.log("Decrypted:", decrypted);

assert(decrypted == msg);
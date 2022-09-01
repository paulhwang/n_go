/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: encode.js
 */

module.exports = {
    malloc: function (root_object_val) {
        var encode_object = new EncodeClass(root_object_val)
        return encode_object;
    },
};

function EncodeClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.encodeString = function(input_val) {
        var header;
        var length = input_val.length;

        if (length < 10) {
            header = "1";
        }
        else if (length < 100) {
            header = "2";
        }
        else if (length < 1000) {
            header = "3";
        }
        else if (length < 10000) {
            header = "4";
        }
        else if (length < 100000) {
            header = "5";
        }
        return header + length + input_val;
    };

    this.objectName = function () {return "EncodeClass";};
    this.rootObject = function () {return this.theRootObject;};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
};

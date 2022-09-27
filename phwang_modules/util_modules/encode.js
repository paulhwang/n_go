/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: encode.js
 */

var the_encode_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_encode_object) {
            the_encode_object = new EncodeClass(root_object_val);
        }
        return the_encode_object;
    },
};

function EncodeClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.debug(true, "init__", "");
    };

    this.decodeNumber = function(input_val, size_val) {
        var output = 0;
        for (var index = 0; index < size_val; index++) {
            output *= 10;
            output += input_val.charAt(index) - '0';
        }
        return output;
    };

    this.encodeString = function(input_val) {
        if ((input_val === undefined) || (input_val === null)) {
            this.abend("encodeString", "null_input_val");
        }
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

    this.encodedStringlength = function(input_val)
    {
        var length = 0;

        switch (input_val.charAt(0)) {
            case '1':
                var length_str = input_val.slice(1, 1 + 1);
                length = this.decodeNumber(length_str, 1);
                return 1 + 1 + length;

            case '2':
                var length_str = input_val.slice(1, 1 + 2);
                length = this.decodeNumber(length_str, 2);
                return 1 + 2 + length;

            case '3':
                var length_str = input_val.slice(1, 1 + 3);
                length = this.decodeNumber(length_str, 3);
                return 1 + 3 + length;

            case '4':
                var length_str = input_val.slice(1, 1 + 4);
                length = this.decodeNumber(length_str, 4);
                return 1 + 4 + length;

            case '5':
                var length_str = input_val.slice(1, 1 + 5);
                length = this.decodeNumber(length_str, 5);
                return 1 + 5 + length;

            default:
                this.abend("encodedStringlength", "TBD");
                return buf;
        }
        return buf;
    };


    this.decodeString = function(input_val)
    {
        var length = 0;
        var buf;

        switch (input_val.charAt(0)) {
            case '1':
                var length_str = input_val.slice(1, 1 + 1);
                length = this.decodeNumber(length_str, 1);
                buf = input_val.slice(1 + 1, 1 + 1 + length);
                return buf;

            case '2':
                var length_str = input_val.slice(1, 1 + 2);
                length = this.decodeNumber(length_str, 2);
                buf = input_val.slice(1 + 2, 1 + 2 + length);
                return buf;

            case '3':
                var length_str = input_val.slice(1, 1 + 3);
                length = this.decodeNumber(length_str, 3);
                buf = input_val.slice(1 + 3, 1 + 3 + length);
                return buf;

            case '4':
                var length_str = input_val.slice(1, 1 + 4);
                length = this.decodeNumber(length_str, 4);
                buf = input_val.slice(1 + 4, 1 + 4 + length);
                return buf;

            case '5':
                var length_str = input_val.slice(1, 1 + 5);
                length = this.decodeNumber(length_str, 5);
                buf = input_val.slice(1 + 5, 1 + 5 + length);
                return buf;

            default:
                this.abend("decodeString", "TBD");
                return buf;
        }
    };

    this.decodeStringGetLength = function(input_val)
    {
        var length = 0;
        switch (input_val.charAt(0)) {
            case '1':
                var length_str = input_val.slice(1, 1 + 1);
                length = this.decodeNumber(length_str, 1);
                return length + 1 + 1;

            case '2':
                var length_str = input_val.slice(1, 1 + 2);
                length = this.decodeNumber(length_str, 2);
                return length + 1 + 2;

            case '3':
                var length_str = input_val.slice(1, 1 + 3);
                length = this.decodeNumber(length_str, 3);
                return length + 1 + 3;

            case '4':
                var length_str = input_val.slice(1, 1 + 4);
                length = this.decodeNumber(length_str, 4);
                return length + 1 + 4;

            case '5':
                var length_str = input_val.slice(1, 1 + 5);
                length = this.decodeNumber(length_str, 5);
                return length + 1 + 5;

            default:
                this.abend("decodeStringGetLength", "TBD");
                return length;
        }
    };

    this.objectName = function () {return "EncodeClass";};
    this.rootObject = function () {return this.theRootObject;};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
};

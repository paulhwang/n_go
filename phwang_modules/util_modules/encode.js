/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: encode.js
 */

var the_encode_object = null;

module.exports = {
    malloc: function () {
        if (!the_encode_object) {
            the_encode_object = new EncodeClass();
        }
        return the_encode_object;
    },
};

function EncodeClass() {
    "use strict";

    this.init__ = function () {
    };

    this.encodeNumber = function(number_val, size_val) {
        const str = number_val.toString();
        let buf = "";
        for (let i = str.length; i < size_val; i++) {
            buf = buf + "0";
        }
        buf = buf + str;
        return buf;
    };

    this.decodeNumber = function(input_val, size_val) {
        let output = 0;
        for (let index = 0; index < size_val; index++) {
            output *= 10;
            output += input_val.charAt(index) - '0';
        }
        return output;
    };

    this.encodeString = function(input_val) {
        if ((input_val === undefined) || (input_val === null)) {
            console.log("EncodeClass.encodeString() null_input_val");
            abend();
        }
        let header;
        const length = input_val.length;

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

    this.encodedStringlength = function(input_val) {
        let length = 0;

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
                console.log("EncodeClass.encodedStringlength() TBD");
                abend();
                return buf;
        }
        return buf;
    };


    this.decodeString = function(input_val)
    {
        let length = 0;
        let buf = "";
        let length_str;

        switch (input_val.charAt(0)) {
            case '1':
                length_str = input_val.slice(1, 1 + 1);
                length = this.decodeNumber(length_str, 1);
                buf = input_val.slice(1 + 1, 1 + 1 + length);
                return buf;

            case '2':
                length_str = input_val.slice(1, 1 + 2);
                length = this.decodeNumber(length_str, 2);
                buf = input_val.slice(1 + 2, 1 + 2 + length);
                return buf;

            case '3':
                length_str = input_val.slice(1, 1 + 3);
                length = this.decodeNumber(length_str, 3);
                buf = input_val.slice(1 + 3, 1 + 3 + length);
                return buf;

            case '4':
                length_str = input_val.slice(1, 1 + 4);
                length = this.decodeNumber(length_str, 4);
                buf = input_val.slice(1 + 4, 1 + 4 + length);
                return buf;

            case '5':
                length_str = input_val.slice(1, 1 + 5);
                length = this.decodeNumber(length_str, 5);
                buf = input_val.slice(1 + 5, 1 + 5 + length);
                return buf;

            default:
                console.log("EncodeClass.decodeString() TBD");
                abend();
                return buf;
        }
    };

    this.decodeStringGetLength = function(input_val) {
        let length = 0;
        let length_str;

        switch (input_val.charAt(0)) {
            case '1':
                length_str = input_val.slice(1, 1 + 1);
                length = this.decodeNumber(length_str, 1);
                return length + 1 + 1;

            case '2':
                length_str = input_val.slice(1, 1 + 2);
                length = this.decodeNumber(length_str, 2);
                return length + 1 + 2;

            case '3':
                length_str = input_val.slice(1, 1 + 3);
                length = this.decodeNumber(length_str, 3);
                return length + 1 + 3;

            case '4':
                length_str = input_val.slice(1, 1 + 4);
                length = this.decodeNumber(length_str, 4);
                return length + 1 + 4;

            case '5':
                length_str = input_val.slice(1, 1 + 5);
                length = this.decodeNumber(length_str, 5);
                return length + 1 + 5;

            default:
                console.log("EncodeClass.decodeStringGetLength() TBD");
                abend();
                return length;
        }
    };

    this.init__();
};

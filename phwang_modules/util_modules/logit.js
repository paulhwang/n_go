/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: logit_module.js
 */

module.exports = {
    LOG_IT: function (str1_val, str2_val) {
        return LOG_IT(str1_val, str2_val);
    },

    ABEND: function (str1_val, str2_val) {
        return ABEND(str1_val, str2_val);
    },
};

var LOG_IT = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log(str1_val + "() " + str2_val);
};

var ABEND = function(str1_val, str2_val) {
    if (str1_val === undefined) {
        str1_val = "UNDEFINED";
    }
    if (str1_val === null) {
        str1_val = "NULL";
    }
    if (str2_val === undefined) {
        str2_val = "UNDEFINED";
    }
    if (str2_val === null) {
        str2_val = "NULL";
    }
    console.log("***ABEND*** " + str1_val + "() " + str2_val);
    console.log("***ABEND*** " + junk);
    this.doCrash();
};

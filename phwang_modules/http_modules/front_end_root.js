/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: front_end_root.js
 */

var the_front_end_root_object = null;

module.exports = {
    malloc: function () {
        if (!the_front_end_root_object) {
            the_front_end_root_object = new FrontEndRootClass();
        }
        return the_front_end_root_object;
    },
};

function FrontEndRootClass () {
    "use strict";

    this.init__ = function () {
        this.FABRIC_DEF_ = require("./fabric_def.js").malloc();
        this.theEncodeObject = require("../util_modules/encode.js").malloc(this);
        this.theFabricServiceObject = require("./fabric_service.js").malloc(this);
        this.theHttpInputObject = require("./http_input.js").malloc(this);
        this.theHttpServiceObject = require("./http_service.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {return "FrontEndRootClass";};
    this.FABRIC_DEF = function () {return this.FABRIC_DEF_;};
    this.encodeObject = function () {return this.theEncodeObject;};
    this.importObject = function () {return this.theImportObject;};
    this.fabricServiceObject = function () {return this.theFabricServiceObject;};
    this.httpInputObject = function () {return this.theHttpInputObject;};
    this.httpServiceObject = function () {return this.theHttpServiceObject;};

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.LOG_IT = function(str1_val, str2_val) {require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);};
    this.ABEND = function(str1_val, str2_val) {require("../util_modules/logit.js").ABEND(str1_val, str2_val);};
    this.init__();
};

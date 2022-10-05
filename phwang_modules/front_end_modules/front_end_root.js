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
        this.encodeObject_ = require("../util_modules/encode.js").malloc(this);
        this.fabricServiceObject_ = require("./fabric_service.js").malloc(this);
        this.httpInputObject_ = require("../http_input.js").malloc(this);
        this.httpServiceObject_ = require("./http_service.js").malloc(this);
        console.log("FrontEndRootClass.init__()");
    };

    this.FABRIC_DEF = () => this.FABRIC_DEF_;
    this.encodeObject = () => this.encodeObject_;
    //this.importObject = function () {return this.theImportObject;};
    this.fabricServiceObject = () => this.fabricServiceObject_;
    this.httpInputObject = () => this.httpInputObject_;
    this.httpServiceObject = () => this.httpServiceObject_;

    this.LOG_IT = function(str1_val, str2_val) {require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);};
    this.ABEND = function(str1_val, str2_val) {require("../util_modules/logit.js").ABEND(str1_val, str2_val);};
    this.init__();
};

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_root.js
 */

let THE_FABRIC_ROOT_OBJECT = null;

module.exports = {
    malloc: function () {
        if (!THE_FABRIC_ROOT_OBJECT) {
            THE_FABRIC_ROOT_OBJECT = new FabricRootClass();
        }
        return THE_FABRIC_ROOT_OBJECT;
    },
};

function FabricRootClass () {
    "use strict";

    this.init__ = function () {
        this.FABRIC_DEF_ = require("./fabric_def.js").malloc();
        this.encodeObject_ = require("../util_modules/encode.js").malloc();
        this.uFabricObj_ = require("./ufabric.js").malloc(this);
        this.httpInputObject_ = require("../http_input.js").malloc(this);
        this.httpServiceObject_ = require("./http_service.js").malloc(this);
        console.log("FrontEndRootClass.init__()");
    };

    this.FABRIC_DEF = () => this.FABRIC_DEF_;
    this.encodeObject = () => this.encodeObject_;
    this.uFabricObj = () => this.uFabricObj_;
    this.httpInputObject = () => this.httpInputObject_;
    this.httpServiceObject = () => this.httpServiceObject_;

    this.LOG_IT = function(str1_val, str2_val) {require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);};
    this.ABEND = function(str1_val, str2_val) {require("../util_modules/logit.js").ABEND(str1_val, str2_val);};
    this.init__();
};

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_root.js
 */

var the_go_root_object = null;


module.exports = {
    malloc: function () {
        if (!the_go_root_object) {
            the_go_root_object = new GoRootClass();
        }
        return the_go_root_object;
    },
};

function GoRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./go_import.js").malloc(this);
        this.theBaseMgrObject = this.importObject().importBaseMgr().malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoRootClass";
    };

    this.importObject = function () {
        return this.theImportObject;
    };

    this.baseMgrObject = function () {
        return this.theBaseMgrObject;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        this.importObject().importLogit().LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
         this.importObject().importLogit().ABEND(str1_val, str2_val);
    };

    this.init__();
};

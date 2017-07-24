/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_root.js
 */

var the_fabric_root_object = null;

module.exports = {
    malloc: function () {
        if (!the_fabric_root_object) {
            the_fabric_root_object = new FabricRootClass();
        }
        return the_fabric_root_object;
    },
};

function FabricRootClass () {
    "use strict";

    this.init__ = function () {
        this.theImportObject = require("./fabric_import.js").malloc(this);
        this.theAjaxFabricServiceObject = this.importObject().importLinkMgrService().malloc(this);
        this.theAjaxObject = this.importObject().importAjax().malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {return "FabricRootClass";};
    this.importObject = function () {return this.theImportObject;};
    this.ajaxFabricServiceObject = function () {return this.theAjaxFabricServiceObject;};
    this.ajaxObject = function () {return this.theAjaxObject;};
    this.ajaxParserObject = function () {return this.ajaxObject().ajaxParserObject();};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.LOG_IT = function(str1_val, str2_val) {this.importObject().importLogit().LOG_IT(str1_val, str2_val);};
    this.ABEND = function(str1_val, str2_val) {this.importObject().importLogit().ABEND(str1_val, str2_val);};
    this.init__();
};

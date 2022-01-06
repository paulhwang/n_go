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
        this.theAjaxFabricServiceObject = require("./link_mgr_service.js").malloc(this);
        this.theHttpInputObject = require("./fabric_ajax.js").malloc(this);
        this.theAjaxWebServiceObject = require("./fabric_ajax_parser.js").malloc(this);
        this.debug(true, "init__", "");
    };

    this.objectName = function () {return "FabricRootClass";};
    this.importObject = function () {return this.theImportObject;};
    this.ajaxFabricServiceObject = function () {return this.theAjaxFabricServiceObject;};
    this.httpInputObject = function () {return this.theHttpInputObject;};
    this.ajaxWebServiceObject = function () {return this.theAjaxWebServiceObject;};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.LOG_IT = function(str1_val, str2_val) {require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);};
    this.ABEND = function(str1_val, str2_val) {require("../util_modules/logit.js").ABEND(str1_val, str2_val);};
    this.init__();
};

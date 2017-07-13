/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fibre_ajax.js
 */

var the_fabric_ajax_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_ajax_object) {
            the_fabric_ajax_object = new FabricAjaxClass(root_object_val);
        }
        return the_fabric_ajax_object;
    },

    post: function (req, res) {
        the_fabric_ajax_object.processHttp(req, res, 0);
    },

    get: function (req, res) {
        the_fabric_ajax_object.processHttp(req, res, 1);
    },

    put: function (req, res) {
        the_fabric_ajax_object.processHttp(req, res, 2);
    },

    delete: function (req, res) {
        the_fabric_ajax_object.processHttp(req, res, 3);
    },

    not_found: function (req, res) {
        the_fabric_ajax_object.processNotFound(req, res);
    },

    failure: function (req, res) {
        the_fabric_ajax_object.processFailure(err, req, res, next);
    },
};

function FabricAjaxClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theAjaxParserObject = this.importObject().importAjaxParser().malloc(this.rootObject());
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricAjaxClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ajaxParserObject = function () {
        return this.theAjaxParserObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.utilObject().utilObject();
    };

    this.processHttp = function (req, res, command_index_val) {
        if (!req.headers.phwangajaxrequest) {
            this.abend("processGet", "null phwangajaxrequest");
            return;
        }

        this.debug(false, "processGet", "phwangajaxrequest=" + req.headers.phwangajaxrequest);

        var go_request = JSON.parse(req.headers.phwangajaxrequest);
        if (!go_request) {
            this.abend("processGet", "null go_request");
            return;
        }

        var data = this.ajaxParserObject().parseGetRequest(req.headers.phwangajaxrequest, command_index_val, res);
    };

    this.sendHttpResponse = function (request_val, res, data_val) {
        var json_str = JSON.stringify({
                        command: request_val.command,
                        data: data_val,
                    });
        this.debug(false, "sendHttpResponse", json_str);
        res.type('application/json');
        res.send(json_str);
    };

    this.processNotFound = function (req, res) {
        console.log(req.headers);
        this.debug(true, "processNotFound", "*****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        this.logit("processFailure", state);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}

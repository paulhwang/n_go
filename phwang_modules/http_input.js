/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: http_input.js
 */

var the_http_input_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_http_input_object) {
            the_http_input_object = new HttpInputClass(root_object_val);
        }
        return the_http_input_object;
    },

    post: function (req, res) {
        the_http_input_object.processHttp(req, res, 0);
    },

    get: function (req, res) {
        the_http_input_object.processHttp(req, res, 1);
    },

    put: function (req, res) {
        the_http_input_object.processHttp(req, res, 2);
    },

    delete: function (req, res) {
        the_http_input_object.processHttp(req, res, 3);
    },

    not_found: function (req, res) {
        the_http_input_object.processNotFound(req, res);
    },

    failure: function (req, res) {
        the_http_input_object.processFailure(err, req, res, next);
    },
};

function HttpInputClass(root_object_val) {
    "use strict";
    this.init__ = function (root_object_val) {
        this.rootObject_ = root_object_val;
        console.log("HttpInputClass.init__()");
    };

    this.processHttp = function (req, res, command_index_val) {
        if (!req.headers.phwangajaxrequest) {
            console.log("HttpInputClass.processHttp() null phwangajaxrequest");
            abend()
            return;
        }

        //console.log("HttpInputClass.processHttp() phwangajaxrequest=" + req.headers.phwangajaxrequest);

        var go_request = JSON.parse(req.headers.phwangajaxrequest);
        if (!go_request) {
            console.log("HttpInputClass.processHttp() null go_request");
            abend();
            return;
        }

        var data = this.httpServiceObject().parseGetRequest(req.headers.phwangajaxrequest, command_index_val, res);
    };

    this.sendHttpResponse = function (res, data_val) {
        //console.log("HttpInputClass.sendHttpResponse() data_val=" + data_val);
        res.type('application/json');
        res.send(data_val);
    };

    this.processNotFound = function (req, res) {
        console.log("HttpInputClass.processNotFound() req.headers=" + req.headers);
        console.log("HttpInputClass.processNotFound() *****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        console.log("HttpInputClass.processFailure() state=" + state);
    };

    this.rootObject = () => this.rootObject_;
    this.httpServiceObject = () => this.rootObject().httpServiceObject();

    this.init__(root_object_val);
}

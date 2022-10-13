/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: d_port.js
 */

let THE_D_PORT_OBJECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_D_PORT_OBJECT) {
            THE_D_PORT_OBJECT = new DPortClass(root_obj_val);
        }
        return THE_D_PORT_OBJECT;
    },

    post: function (req, res) {
        THE_D_PORT_OBJECT.processHttp(req, res, 0);
    },

    get: function (req, res) {
        THE_D_PORT_OBJECT.processHttp(req, res, 1);
    },

    put: function (req, res) {
        THE_D_PORT_OBJECT.processHttp(req, res, 2);
    },

    delete: function (req, res) {
        THE_D_PORT_OBJECT.processHttp(req, res, 3);
    },

    not_found: function (req, res) {
        THE_D_PORT_OBJECT.processNotFound(req, res);
    },

    failure: function (req, res) {
        THE_D_PORT_OBJECT.processFailure(err, req, res, next);
    },
};

function DPortClass(root_obj_val) {
    "use strict";
    this.init__ = function (root_obj_val) {
        this.rootObj_ = root_obj_val;
    };

    this.processHttp = function (req, res, command_index_val) {
        const data = req.headers.phwangajaxrequest;
        if (!data) {
            console.log("DPortClass.processHttp() null phwangajaxrequest");
            abend()
            return;
        }

        if (data.charAt(14 + 1) !== 'D') {
            console.log("DPortClass.processHttp() data=" + data);
        }

        this.dFabricObj().parseGetRequest(data, res);
    };

    this.sendHttpResponse = function (res, data_val) {
        //console.log("DPortClass.sendHttpResponse() data_val=" + data_val);
        res.type('application/json');
        res.send(data_val);
    };

    this.processNotFound = function (req, res) {
        console.log("DPortClass.processNotFound() req.headers=" + req.headers);
        console.log("DPortClass.processNotFound() *****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        console.log("DPortClass.processFailure() state=" + state);
    };

    this.rootObj = () => this.rootObj_;
    this.dFabricObj = () => this.rootObj().dFabricObj();

    this.init__(root_obj_val);
}

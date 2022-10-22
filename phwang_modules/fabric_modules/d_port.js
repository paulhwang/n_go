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
        THE_D_PORT_OBJECT.receiveData(req, res, 0);
    },

    get: function (req, res) {
        THE_D_PORT_OBJECT.receiveData(req, res, 1);
    },

    put: function (req, res) {
        THE_D_PORT_OBJECT.receiveData(req, res, 2);
    },

    delete: function (req, res) {
        THE_D_PORT_OBJECT.receiveData(req, res, 3);
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
        this.timeStamp_ = "";
    };

    this.receiveData = function (req, res, command_index_val) {
        let data = req.headers.phwangajaxrequest;
        if (!data) {
            console.log("DPortClass.receiveData() null phwangajaxrequest");
            abend()
            return;
        }

        if (data.charAt(0) === '{') {
            if (data.slice(0, this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE()) !== this.timeStamp()) {
                console.log("DPortClass.receiveData() bad time_stamp");
                return;
            }
            data = data.slice(this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE());
        }

        if (data.charAt(this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE() + 1) !== this.FABRIC_DEF().GET_LINK_DATA_COMMAND()) {
            console.log("DPortClass.receiveData() data=" + data);
        }

        this.dNodeObj().parseRequest(data, res);
    };

    this.transmitData = function (res, data_val) {
        //console.log("DPortClass.transmitData() data_val=" + data_val);
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
    this.timeStamp = () => this.timeStamp_;
    this.setTimeStamp = (time_stamp_val) => {this.timeStamp_ = time_stamp_val;}
    this.dNodeObj = () => this.rootObj().dNodeObj();
    this.FABRIC_DEF = () => this.rootObj().FABRIC_DEF();

    this.init__(root_obj_val);
}

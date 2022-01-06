/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: net_socket.js
 */

module.exports = {
    malloc: function (root_object_val) {
        var net_socket_object = new NetSocketClass(root_object_val)
        return net_socket_object;
    },

    //connect: function (net_socket_object_val, port_val, host_name_val, func_val) {
    //    net_socket_object_val.connect(port_val, host_name_val, func_val);
    //},

};

function NetSocketClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;

        this.theNetModule = require("net");
        this.theNetSocket = new this.theNetModule.Socket();///////////////////////////////////
		this.netSocket().setEncoding('utf8');

        this.debug(true, "init__", "");
    };

    this.connect = function (port_val, host_name_val, func_val) {this.netSocket().connect(port_val, host_name_val, func_val);};
    this.write = function (data_val) {this.netSocket().write(data_val);};
    this.onData = function (func_val) {this.netSocket().on("data", func_val);};
    this.onClose = function (func_val) {this.netSocket().on("close", func_val);};

    this.objectName = function () {return "NetSocketClass";};
    this.rootObject = function () {return this.theRootObject;};
    this.netSocket = function () {return this.theNetSocket;};

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
};

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: net_socket.js
 */

module.exports = {
    malloc: function () {
        var net_socket_object = new NetSocketClass()
        return net_socket_object;
    },

    //connect: function (net_socket_object_val, port_val, host_name_val, func_val) {
    //    net_socket_object_val.connect(port_val, host_name_val, func_val);
    //},

};

function NetSocketClass() {
    "use strict";

    this.init__ = function () {
        this.netModule_ = require("net");
        this.netSocket_ = new this.netModule_.Socket();///////////////////////////////////
		this.netSocket().setEncoding('utf8');

        console.log("NetSocketClass.init__()");
    };

    this.connect = function (port_val, host_name_val, func_val) {
        this.netSocket().connect(port_val, host_name_val, func_val);
    };

    this.write = function (data_val) {
        this.netSocket().write(data_val);
    };

    this.onData = function (func_val) {
        this.netSocket().on("data", func_val);
    };

    this.onClose = function (func_val) {
        this.netSocket().on("close", func_val);
    };

    this.netSocket = () => this.netSocket_;
    this.init__();
};

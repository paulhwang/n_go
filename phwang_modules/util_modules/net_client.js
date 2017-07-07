/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: net_client.js
 */

module.exports = {
    malloc: function (root_object_val) {
        var net_client = new NetClientClass(root_object_val)
        return net_client;
    },

    connect: function (net_client_object_val, port_val, host_name_val, func_val) {
        net_client_object_val.connect(port_val, host_name_val, func_val);
    },

};

function NetClientClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;

        this.theNet = require("net");
        this.theClient = new this.theNet.Socket();///////////////////////////////////
		this.client().setEncoding('utf8');

        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "NetClientClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.net123 = function () {
        return this.theNet;
    };

    this.client = function () {
        return this.theClient;
    };

    this.connect = function (port_val, host_name_val, func_val) {
        this.client().connect(port_val, host_name_val, func_val);
    };

    this.write = function (data_val) {
        this.client().write(data_val);
    };

    this.onData = function (func_val) {
        this.client().on("data", func_val);
    };

    this.onClose = function (func_val) {
        this.client().on("close", func_val);
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
};

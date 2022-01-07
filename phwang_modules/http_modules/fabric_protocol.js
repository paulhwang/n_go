/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_protocol.js
 */

var FABRIC_SERVER_IP_ADDRESS = "127.0.0.1";
var FABRIC_SERVER_TCP_PORT = 8006;
var FABRIC_SERVER_AJAX_ID_SIZE = 3;
var FABRIC_SERVER_DATA_LENGTH_SIZE = 5;

var the_fabric_service_object = null;

module.exports = {
};

function FabricProtocolClass () {
    "use strict";
    this.fabricSeriverIpAddr = function () {return FABRIC_SERVER_IP_ADDRESS;};
    this.fabricSeriverTcpPort = function () {return FABRIC_SERVER_TCP_PORT;};
    this.fabricSeriverAjaxIdSize = function () {return FABRIC_SERVER_AJAX_ID_SIZE;};
    this.fabricSeriverDataLengthSize = function () {return FABRIC_SERVER_DATA_LENGTH_SIZE;};
    this.objectName = function () {return "FabricProtocolClass";};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
}

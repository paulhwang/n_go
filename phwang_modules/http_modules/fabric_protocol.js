/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_protocol.js
 */

var FABRIC_PROTOCOL_SERVER_IP_ADDRESS = "127.0.0.1";
var FABRIC_PROTOCOL_SERVER_TCP_PORT = 8006;
var FABRIC_PROTOCOL_AJAX_ID_SIZE = 3;
var FABRIC_PROTOCOL_DATA_LENGTH_SIZE = 4;

var the_fabric_protocol_object = null;

module.exports = {
    malloc: function () {
        if (!the_fabric_protocol_object) {
            the_fabric_protocol_object = new FabricProtocolClass();
        }
        return the_fabric_protocol_object;
    },
};

function FabricProtocolClass () {
    this.fabricSeriverIpAddr = function () {return FABRIC_PROTOCOL_SERVER_IP_ADDRESS;};
    this.fabricSeriverTcpPort = function () {return FABRIC_PROTOCOL_SERVER_TCP_PORT;};
    this.fabricSeriverAjaxIdSize = function () {return FABRIC_PROTOCOL_AJAX_ID_SIZE;};
    this.fabricSeriverDataLengthSize = function () {return FABRIC_PROTOCOL_DATA_LENGTH_SIZE;};
}

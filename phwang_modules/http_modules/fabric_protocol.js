/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_protocol.js
 */

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
    this.RESULT_SIZE = function() {return 2;};
    this.LINK_ID_SIZE = function() {return 8;};
    this.SESSION_ID_SIZE = function() {return 8;};
    this.AJAX_ID_SIZE = function () {return 3;};

    this.FABRIC_IP_ADDRESS = function () {return "127.0.0.1";};
    this.FABRIC_TCP_PORT = function () {return 8006;};

    this.fabricSeriverDataLengthSize = function () {return FABRIC_PROTOCOL_DATA_LENGTH_SIZE;};
}

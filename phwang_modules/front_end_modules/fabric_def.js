/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_def.js
 */

var THE_FABRIC_DEF = null;

module.exports = {
    malloc: function () {
        if (!THE_FABRIC_DEF) {
            THE_FABRIC_DEF = new FABRIC_DEF_CLASS();
        }
        return THE_FABRIC_DEF;
    },
};

function FABRIC_DEF_CLASS () {
    this.RESULT_SIZE = function() {return 2;};
    this.LINK_ID_SIZE = function() {return 8;};
    this.SESSION_ID_SIZE = function() {return 8;};
    this.AJAX_ID_SIZE = function () {return 3;};

    this.FABRIC_IP_ADDRESS = function () {return "127.0.0.1";};
    this.FABRIC_TCP_PORT = function () {return 8006;};
    this.FABRIC_TCP_DATA_SIZE = function () {return 4;};
}

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_def.js
 */

let THE_FABRIC_DEF = null;

module.exports = {
    malloc: function () {
        if (!THE_FABRIC_DEF) {
            THE_FABRIC_DEF = new FABRIC_DEF_CLASS();
        }
        return THE_FABRIC_DEF;
    },
};

function FABRIC_DEF_CLASS () {
    this.LOGIN_RESPONSE         = () => 'i';
    this.GET_LINK_DATA_RESPONSE = () => 'd';

    this.FABRIC_TIME_STAMP_SIZE = () => 8;
    this.RESULT_SIZE            = () => 2;
    this.LINK_ID_SIZE           = () => 8;
    this.SESSION_ID_SIZE        = () => 8;
    this.AJAX_ID_SIZE           = () => 3;

    this.FABRIC_IP_ADDRESS = () => "127.0.0.1";
    this.FABRIC_TCP_PORT   = () => 8006;
    this.FABRIC_TCP_DATA_SIZE = () => 4;

    this.NAME_LIST_TAG_SIZE = () => 3;
    this.GET_LINK_DATA_LENGTH_SIZE = () => 2;
    this.GET_LINK_DATA_TYPE_NAME_LIST        = () => 'N';
    this.GET_LINK_DATA_TYPE_PENDING_SESSION2 = () => 'Y';
    this.GET_LINK_DATA_TYPE_PENDING_SESSION3 = () => 'Z';
    this.GET_LINK_DATA_TYPE_PENDING_DATA     = () => 'D';

    this.PHWANG_LOGO = () => "phwang168";

}

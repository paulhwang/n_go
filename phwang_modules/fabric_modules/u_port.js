/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: u_port.js
 */

let THE_U_PORT_OJBECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_U_PORT_OJBECT) {
            THE_U_PORT_OJBECT = new UPortClass(root_obj_val);
        }
        return THE_U_PORT_OJBECT;
    },
};

function UPortClass (root_obj_val) {
    "use strict";

    this.init__ = function (root_obj_val) {
        this.rootObj_ = root_obj_val;

        this.netSocketObj_ =  require("../util_modules/net_socket.js").malloc();
        this.connectionFabric();
    };

    this.connectionFabric = function () {
        var this0 = this;
        this.netSocketObj().connect(this.FABRIC_DEF().FABRIC_TCP_PORT(), this.FABRIC_DEF().FABRIC_IP_ADDRESS(), function () {
            console.log("UPortClass.connectionFabric() connected!");
        });

        this.netSocketObj().write(this.FABRIC_DEF().PHWANG_LOGO());

        this.netSocketObj().onData(function (data_val) {
            this0.receiveData(data_val);
        });

        this.netSocketObj().onClose(function () {
            this0.receiveClose();
        });
    };

    this.receiveData = function (raw_data_val) {
        const raw_length = raw_data_val.length;
        let data_val;

        if (this.dPortObj().timeStamp() === "") {
            const index = 1 + this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE();
            this.dPortObj().setTimeStamp(raw_data_val.slice(index, index + this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE()));
            console.log("UPortClass.receiveData() time_stamp=" + this.dPortObj().timeStamp());
            return;
        }

        if (raw_data_val.charAt(0) === '{') {
            data_val = raw_data_val.slice(1 + this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE(), raw_length - 1);
        }
        else {
            console.log("UPortClass.receiveData() wrong header=" + raw_data_val);
            abend();
            return;
        }

        if (data_val.charAt(this.FABRIC_DEF().AJAX_ID_SIZE()) != this.FABRIC_DEF().GET_LINK_DATA_RESPONSE()) {
            console.log("UPortClass.receiveData() data=" + data_val);
        }

        const ajax_id_val = data_val.slice(0, this.FABRIC_DEF().AJAX_ID_SIZE());
        const real_data = data_val.slice(this.FABRIC_DEF().AJAX_ID_SIZE());

        const ajax_entry_object = this.uNodeObj().getAjaxEntry(ajax_id_val);
        if (!ajax_entry_object) {
            console.log("UPortClass.receiveData() null ajax_entry_object");
            abend();
            return;
        }

        //console.log("UPortClass.receiveData() real_data=" + real_data);
        this.dPortObj().transmitData(ajax_entry_object.ajaxResponse(), real_data);
    };

    this.receiveClose = function () {
        console.log("UPortClass.receiveClose()");
    };

    this.transmitData = function (ajax_entry_object_val, data_val) {
        this.uNodeObj().putAjaxEntry(ajax_entry_object_val);
        let data;
        if (data_val.length < 1000) {
            data = "{" + this.encodeObj().encodeNumber(data_val.length, this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE()) + data_val + "}";
        }

        if (data.charAt(this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE() + this.FABRIC_DEF().AJAX_ID_SIZE() + this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE() + 2) !== 'D') {
            console.log("UPortClass.transmitData() data=" + data);
        }

        this.netSocketObj().write(data);
    };

    this.rootObj = () => this.rootObj_;
    this.FABRIC_DEF = () => this.rootObj().FABRIC_DEF();
    this.netSocketObj = () => this.netSocketObj_;
    this.uNodeObj = () => this.rootObj().uNodeObj();
    this.dNodeObj = () => this.rootObj().dnodeObj();
    this.dPortObj = () => this.rootObj().dPortObj();
    this.encodeObj = () => this.rootObj().encodeObj();

    this.init__(root_obj_val);
}

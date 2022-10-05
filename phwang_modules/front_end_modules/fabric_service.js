/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_service.js
 */

var the_fabric_service_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_service_object) {
            the_fabric_service_object = new FabricServiceClass(root_object_val);
        }
        return the_fabric_service_object;
    },
};

function AjaxEntryClass (ajax_id_val, callback_func_val, go_request_val, res_val) {
    "use strict";

    this.init__ = function (ajax_id_val, callback_func_val, go_request_val, res_val) {
        this.ajaxId_ = ajax_id_val;
        this.callbackFunction_ = callback_func_val;
        this.ajaxRequest_ = go_request_val;
        this.ajaxResponse_ = res_val;
    }

    this.ajaxId = () => this.ajaxId_;
    this.callbackFunction = () => this.callbackFunction_;
    this.ajaxRequest = () => this.ajaxRequest_;
    this.ajaxResponse = () => this.ajaxResponse_;
    this.init__(ajax_id_val, callback_func_val, go_request_val, res_val);
}

function FabricServiceClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.rootObject_ = root_object_val;
        this.timeStampString_ = "";
        this.netSocketObject_ =  require("../util_modules/net_socket.js").malloc(this.rootObject());
        this.setupConnectionToFabric();
        this.theGlobalAjaxId = 0;
        this.theMaxAjaxIdIndex = 0;
        this.theAjaxIdArray = [];
        this.setMaxGlobalAjaxId(this.FABRIC_DEF().AJAX_ID_SIZE());
        console.log("FabricServiceClass.init__()");
    };

    this.mallocAjaxEntryObject = function (callback_func_val, go_request_val, res_val) {
        this.incrementGlobalAjaxId();
        var ajax_id_str = this.encodeNumber(this.globalAjaxId(), this.FABRIC_DEF().AJAX_ID_SIZE());
        var ajax_entry_object = new AjaxEntryClass(ajax_id_str, callback_func_val, go_request_val, res_val);
        return ajax_entry_object;
    };

    this.setupConnectionToFabric = function () {
        var this0 = this;
        this.netSocketOjbect().connect(this.FABRIC_DEF().FABRIC_TCP_PORT(), this.FABRIC_DEF().FABRIC_IP_ADDRESS(), function () {
            console.log("FabricServiceClass.setupConnectionToFabric() fabric is connected");
        });

        this.netSocketOjbect().write(this.FABRIC_DEF().PHWANG_LOGO());

        this.netSocketOjbect().onData(function (data_val) {
            this0.receiveDataFromFabric(data_val);
        });

        this.netSocketOjbect().onClose(function () {
            this0.receiveCloseFromFabric();
        });
    };

    this.receiveDataFromFabric = function (raw_data_val) {
        if (this.timeStampString() === "") {
            this.setTimeStampString(raw_data_val);
            console.log("FabricServiceClass.receiveDataFromFabric() timeStampString=" + this.timeStampString());
            return;
        }

        const raw_length = raw_data_val.length;
        let data_val;

        if (raw_data_val.charAt(0) === '{') {
            data_val = raw_data_val.slice(1 + this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE(), raw_length - 1);
        }
        else {
            console.log("FabricServiceClass.receiveDataFromFabric() wrong header=" + raw_data_val);
            abend();
            return;
        }

        if (data_val.charAt(0) != 'd') {
            console.log("FabricServiceClass.receiveDataFromFabric() data=" + data_val);
        }

        const ajax_id_val = data_val.slice(1, 1 + this.FABRIC_DEF().AJAX_ID_SIZE());
        let rest_data_val = data_val.slice(1 + this.FABRIC_DEF().AJAX_ID_SIZE());

        const ajax_entry_object = this.getAjaxEntryObject(ajax_id_val);
        if (!ajax_entry_object) {
            console.log("FabricServiceClass.receiveDataFromFabric() null ajax_entry_object");
            abend();
            return;
        }

        ajax_entry_object.callbackFunction().bind(this.httpServiceObject())(this.httpServiceObject(), rest_data_val, ajax_entry_object);
    };

    this.receiveCloseFromFabric = function () {
        console.log("FabricServiceClass.receiveCloseFromFabric()");
    };

    this.encodeNumber = function(number_val, size_val) {
        const str = number_val.toString();
        let buf = "";
        for (let i = str.length; i < size_val; i++) {
            buf = buf + "0";
        }
        buf = buf + str;
        return buf;
    };

    this.transmitData = function (ajax_entry_object_val, data_val) {
        this.putAjaxEntryObject(ajax_entry_object_val);
        let data;
        if (data_val.length < 1000) {
            data = "{" + this.encodeNumber(data_val.length, this.FABRIC_DEF().FABRIC_TCP_DATA_SIZE()) + data_val + "}";
        }
        console.log("FabricServiceClass.transmitData() data=" + data);
        this.netSocketOjbect().write(data);
    };

    this.getAjaxEntryObject = function (ajax_id_val) {
        let found = false;
        let index = 0;
        for (; index < this.maxAjaxIdIndex(); index++) {
            if (this.ajaxIdArrayElement(index)) {
                if (this.ajaxIdArrayElement(index).ajaxId() === ajax_id_val) {
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            console.log("FabricServiceClass.getAjaxEntryObject() not_found! ajax_id_val=" + ajax_id_val);
            abend();
            return;
        }

        const element = this.ajaxIdArrayElement(index);
        this.clearAjaxIdArrayElement(index)
        return element;
    };

    this.putAjaxEntryObject = function (val) {
        for (let i = 0; i < this.maxAjaxIdIndex(); i++) {
            if (!this.ajaxIdArrayElement(i)) {
                this.setAjaxIdArrayElement(i, val);
                return;
            }
        }
        this.setAjaxIdArrayElement(this.maxAjaxIdIndex(), val);
        this.incrementMaxAjaxIdIndex();
    };

    this.incrementGlobalAjaxId = function () {
        this.theGlobalAjaxId++;
        if (this.theGlobalAjaxId > this.maxGolbalAjaxId()) {
            this.theGlobalAjaxId = 1;
        }
    };

    this.setMaxGlobalAjaxId = function (ajax_id_size_val) {
        this.theMaxGolbalAjaxId = 1;
        for (let i = 0; i < ajax_id_size_val; i++) {
            this.theMaxGolbalAjaxId *= 10;
        }
        this.theMaxGolbalAjaxId -= 1;
    };

    this.maxAjaxIdIndex = function () {return this.theMaxAjaxIdIndex;};
    this.incrementMaxAjaxIdIndex = function () {this.theMaxAjaxIdIndex++;};
    this.globalAjaxId = function () {return this.theGlobalAjaxId;};
    this.maxGolbalAjaxId = function () {return this.theMaxGolbalAjaxId;};
    this.ajaxIdArrayElement = function (index) {return this.theAjaxIdArray[index];};
    this.setAjaxIdArrayElement = function (index, val) {this.theAjaxIdArray[index] = val;};
    this.clearAjaxIdArrayElement = function (index) {this.theAjaxIdArray[index] = 0;};

    //this.objectName = function () {return "FabricServiceClass";};
    //this.phwangLogo = function () {return "phwang168";};
    this.rootObject = () => this.rootObject_;
    this.FABRIC_DEF = () => this.rootObject().FABRIC_DEF();
    this.netSocketOjbect = () => this.netSocketObject_;
    this.httpServiceObject = () => this.rootObject().httpServiceObject();
    //this.importObject = function () {return this.rootObject().importObject();};
    this.timeStampString = () => this.timeStampString_;
    this.setTimeStampString = (val) => {this.timeStampString_ = val;}

    this.init__(root_object_val);
}

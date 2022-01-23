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
        this.theAjaxId = ajax_id_val;
        this.theCallbackFunction = callback_func_val;
        this.theAjaxRequest = go_request_val;
        this.theAjaxResponse = res_val;
    }

    this.ajaxId = function () {return this.theAjaxId;};
    this.callbackFunction = function () {return this.theCallbackFunction;};
    this.ajaxRequest = function () {return this.theAjaxRequest;}
    this.ajaxResponse = function () {return this.theAjaxResponse;}
    this.init__(ajax_id_val, callback_func_val, go_request_val, res_val);
}

function FabricServiceClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theTimeStampString = "";
        this.theFabricProtocolObject = require("./fabric_protocol.js").malloc();
        this.theNetSocketObject =  require("../util_modules/net_socket.js").malloc(this.rootObject());
        this.setupConnectionToFabric();
        this.theGlobalAjaxId = 0;
        this.theMaxAjaxIdIndex = 0;
        this.theAjaxIdArray = [];
        this.setMaxGlobalAjaxId(this.fabricSeriverAjaxIdSize());
        this.debug(true, "init__", "");
    };

    this.mallocAjaxEntryObject = function (callback_func_val, go_request_val, res_val) {
        this.incrementGlobalAjaxId();
        var ajax_id_str = this.encodeNumber(this.globalAjaxId(), this.fabricSeriverAjaxIdSize());
        var ajax_entry_object = new AjaxEntryClass(ajax_id_str, callback_func_val, go_request_val, res_val);
        return ajax_entry_object;
    };

    this.setupConnectionToFabric = function () {
        var this0 = this;
        this.netSocketOjbect().connect(this.fabricSeriverTcpPort(), this.fabricSeriverIpAddr(), function () {
            this0.debug(true, "init__", "fabric is connected");
        });

        this.netSocketOjbect().write(this.phwangLogo());

        this.netSocketOjbect().onData(function (data_val) {
            this0.receiveDataFromFabric(data_val);
        });

        this.netSocketOjbect().onClose(function () {
            this0.receiveCloseFromFabric();
        });
    };

    this.receiveDataFromFabric = function (raw_data_val) {
        if (this.timeStampString() === "") {
            this.theTimeStampString = raw_data_val;
            this.debug(true, "receiveDataFromFabric", "timeStampString=" + this.timeStampString());
            return;
        }

        var raw_length = raw_data_val.length;
        var data_val;

        if (raw_data_val.charAt(0) === '{') {
            data_val = raw_data_val.slice(1 + this.fabricSeriverDataLengthSize(), raw_length - 1);
        }
        else {
            this.abend("receiveDataFromFabric", "wrong header: " + raw_data_val);
            return;
        }

        if (data_val.charAt(0) != 'd') {
            this.debug(true, "receiveDataFromFabric", data_val);
        }

        var ajax_id_val = data_val.slice(1, 1 + this.fabricSeriverAjaxIdSize());
        var rest_data_val = data_val.slice(1 + this.fabricSeriverAjaxIdSize());

        var ajax_entry_object = this.getAjaxEntryObject(ajax_id_val);
        if (!ajax_entry_object) {
            this.abend("receiveDataFromFabric", "null ajax_entry_object");
            return;
        }

        ajax_entry_object.callbackFunction().bind(this.httpServiceObject())(this.httpServiceObject(), rest_data_val, ajax_entry_object);
    };

    this.receiveCloseFromFabric = function () {
        this.debug(true, "receiveCloseFromFabric", "");
    };

    this.encodeNumber = function(number_val, size_val) {
        var str = number_val.toString();
        var buf = "";
        for (var i = str.length; i < size_val; i++) {
            buf = buf + "0";
        }
        buf = buf + str;
        return buf;
    };

    this.transmitData = function (ajax_entry_object_val, data_val) {
        this.putAjaxEntryObject(ajax_entry_object_val);
        if (data_val.length < 1000) {
            var data = "{" + this.encodeNumber(data_val.length, this.fabricSeriverDataLengthSize()) + data_val + "}";
        }
        this.debug(false, "transmitData", data);
        this.netSocketOjbect().write(data);
    };

    this.getAjaxEntryObject = function (ajax_id_val) {
        var found = false;
        for (var i = 0; i < this.maxAjaxIdIndex(); i++) {
            if (this.ajaxIdArrayElement(i)) {
                if (this.ajaxIdArrayElement(i).ajaxId() === ajax_id_val) {
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            this.abend("getAjaxEntryObject", "not found" + ajax_id_val);
            return;
        }

        var element = this.ajaxIdArrayElement(i);
        this.clearAjaxIdArrayElement(i)
        return element;
    };

    this.putAjaxEntryObject = function (val) {
        for (var i = 0; i < this.maxAjaxIdIndex(); i++) {
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
        for (var i = 0; i < ajax_id_size_val; i++) {
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

    this.objectName = function () {return "FabricServiceClass";};
    this.phwangLogo = function () {return "phwang168";};
    this.rootObject = function () {return this.theRootObject;};
    this.fabricProtocolObject = function () {return this.theFabricProtocolObject;};
    this.netSocketOjbect = function () {return this.theNetSocketObject;};
    this.httpServiceObject = function () {return this.rootObject().httpServiceObject();};
    this.importObject = function () {return this.rootObject().importObject();};
    this.timeStampString = function () {return this.theTimeStampString;};

    this.fabricSeriverIpAddr = function () {return this.fabricProtocolObject().fabricSeriverIpAddr();};
    this.fabricSeriverTcpPort = function () {return this.fabricProtocolObject().fabricSeriverTcpPort();};
    this.fabricSeriverAjaxIdSize = function () {return this.fabricProtocolObject().fabricSeriverAjaxIdSize();};
    this.fabricSeriverDataLengthSize = function () {return this.fabricProtocolObject().fabricSeriverDataLengthSize();};

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
}

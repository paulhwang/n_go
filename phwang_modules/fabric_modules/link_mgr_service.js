/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_serveric.js
 */

var LINK_MGR_SERVICE_IP_ADDRESS = "52.24.162.133";
var LINK_MGR_SERVICE_IP_PORT = 8006;

var the_link_mgr_service_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_link_mgr_service_object) {
            the_link_mgr_service_object = new LinkMgrServiceClass(root_object_val);
        }
        return the_link_mgr_service_object;
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
    this.clearCallbackFunction = function () {this.theCallbackFunction = 0;};
    this.setCallbackFunction = function (val)
    {
        if (this.theCallbackFunction !== 0) {
            this.abend("setCallbackFunction", this.theCallbackFunction);
        }
        this.theCallbackFunction = val;
    };
    this.ajaxRequest = function () {return this.theAjaxRequest;}
    this.ajaxResponse = function () {return this.theAjaxResponse;}
    this.init__(ajax_id_val, callback_func_val, go_request_val, res_val);
}

function LinkMgrServiceClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theNetClientObject = this.importObject().importNetClient().malloc(this.rootObject());
        this.setupConnectionToLinkMgr();
        this.theGlobalAjaxId = 0;
        this.theMaxAjaxId = 0;
        this.theAjaxIdArray = [];
        this.debug(true, "init__", "");
    };

    this.mallocAjaxEntryObject = function (callback_func_val, go_request_val, res_val) {
        this.incrementGlobalAjaxId();
        var ajax_id_str = this.encodeNumber(this.globalAjaxId(), this.ajaxIdSize());
        var ajax_entry_object = new AjaxEntryClass(ajax_id_str, callback_func_val, go_request_val, res_val);
        return ajax_entry_object;
    };

    this.searchAjaxEntryObject = function (ajax_id_val) {
       return this.theAjaxEntryObject;
    };

    this.freeAjaxEntryObject = function (ajax_entry_object_val) {
        ajax_entry_object_val.clearCallbackFunction();
    };

    this.setupConnectionToLinkMgr = function () {
        var this0 = this;
        this.netClientOjbect().connect(LINK_MGR_SERVICE_IP_PORT, LINK_MGR_SERVICE_IP_ADDRESS, function () {
            this0.debug(true, "init__", "LinkMgrService is connected");
        });

        this.netClientOjbect().onData(function (data_val) {
            this0.receiveDataFromLinkMgr(data_val);
        });

        this.netClientOjbect().onClose(function () {
            this0.receiveCloseFromLinkMgr();
        });
    };

    this.receiveDataFromLinkMgr = function (data_val) {
        if (data_val.charAt(0) != 'd') {
            this.debug(true, "receiveDataFromLinkMgr", data_val);
        }
        if (this.ajaxEntryObject().callbackFunction() === 0) {
            this.abend("receiveDataFromLinkMgr", this.theGoRequest.command + ": null callbackFunction");
            return;
        }
        var ajax_entry_object = this.searchAjaxEntryObject();
        if (!ajax_entry_object) {
            this.abend("receiveDataFromLinkMgr", "null ajax_entry_object");
            return;
        }
        ajax_entry_object.callbackFunction().bind(this.ajaxParserObject())(this.ajaxParserObject(), data_val.slice(1 + this.ajaxIdSize()), this.ajaxEntryObject());
        this.freeAjaxEntryObject(ajax_entry_object);
    };

    this.receiveCloseFromLinkMgr = function () {
        this.debug(true, "receiveCloseFromLinkMgr", "");
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
        this.setAjaxEntryObject(ajax_entry_object_val);
        this.netClientOjbect().write(data_val);
    };

    this.ajaxIdSize = function () {return 3;};
    this.theMaxAjaxId = function () {return this.theMaxAjaxId;};
    this.setMaxAjaxId = function (val) {this.theMaxAjaxId = val;};
    this.globalAjaxId = function () {return this.theGlobalAjaxId;};
    this.incrementGlobalAjaxId = function () {this.theGlobalAjaxId++;};
    this.ajaxIdArrayElement = function (index) {return this.theAjaxIdArray[index];};
    this.setAjaxIdArrayElement = function (index, val) {this.theAjaxIdArray[index] = val;};
    this.ajaxEntryObject = function () {return this.theAjaxEntryObject;};
    this.setAjaxEntryObject = function (val) {this.theAjaxEntryObject = val;};
    this.objectName = function () {return "LinkMgrServiceClass";};
    this.rootObject = function () {return this.theRootObject;};
    this.netClientOjbect = function () {return this.theNetClientObject;};
    this.ajaxParserObject = function () {return this.rootObject().ajaxParserObject();};
    this.importObject = function () {return this.rootObject().importObject();};
    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
}

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

function AjaxEntryClass (callback_func_val, go_request_val, res_val) {
    "use strict";

    this.init__ = function (callback_func_val, go_request_val, res_val) {
        this.theCallbackFunction = callback_func_val;
        this.theAjaxRequest = go_request_val;
        this.theAjaxResponse = res_val;
    }

    this.callbackFunction = function () {return this.theCallbackFunction;}
    this.ajaxRequest = function () {return this.theAjaxRequest;}
    this.ajaxResponse = function () {return this.theAjaxResponse;}
    this.init__(callback_func_val, go_request_val, res_val);
}

function LinkMgrServiceClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theNetClientObject = this.importObject().importNetClient().malloc(this.rootObject());
        this.setupConnectionToLinkMgr();
        this.theCallbackFunction = 0;
        this.debug(true, "init__", "");
    };

    this.mallocAjaxEntryObject = function (callback_func_val, go_request_val, res_val) {
       var ajax_entry_object = new AjaxEntryClass(callback_func_val, go_request_val, res_val);
       return ajax_entry_object;
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
        if (this.callbackFunction() === 0) {
            this.abend("receiveDataFromLinkMgr", this.theGoRequest.command + ": null callbackFunction");
            return;
        }
        this.callbackFunction().bind(this.ajaxParserObject())(this.ajaxParserObject(), data_val.slice(1), this.theFabricRequestObject);
        this.clearCallbackFunction();
    };

    this.receiveCloseFromLinkMgr = function () {
        this.debug(true, "receiveCloseFromLinkMgr", "");
    };

    this.setupLink = function (my_name_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("L" + my_name_val);
    };

    this.getLinkByIdIndexName = function (link_id_index_val, link_name_val) {
        this.debug(true, "getLinkByIdIndexName", "link_id_index_val=" + link_id_index_val);
    };

    this.getLinkData = function (link_id_index_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(false, "getLinkData", "link_id_index_val=" + link_id_index_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("D" +  link_id_index_val);
    };

    this.getNameList = function (link_id_index_val, name_list_tag_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(false, "getNameList", "link_id_index_val=" + link_id_index_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("N" +  link_id_index_val + name_list_tag_val);
    };

    this.setupSession = function (link_id_index_val, his_name_val, theme_data_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(true, "setupSession", "link_id_index_val=" + link_id_index_val + " his_name_val=" + his_name_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("S" + link_id_index_val + theme_data_val + his_name_val);
    };

    this.setupSessionReply = function (link_id_index_val, session_id_index_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(true, "setupSessionReply", "link_id_index_val=" + link_id_index_val + " session_id_index_val=" + session_id_index_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("R" + link_id_index_val + session_id_index_val);
    };

    this.getSessionData = function (link_id_index_val, session_id_index_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(true, "getSessionData", "link_id_index_val=" + link_id_index_val + " session_id_index_val=" + session_id_index_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("G" + link_id_index_val + session_id_index_val);
    };

    this.putSessionData = function (link_id_index_val, session_id_index_val, data_val, callback_func_val, go_request_val, res_val, ajax_entry_object_val) {
        this.debug(true, "putSessionData", "link_id_index_val=" + link_id_index_val + " session_id_index_val=" + session_id_index_val + " data_val=" + data_val);
        this.theFabricRequestObject = ajax_entry_object_val;
        this.setCallbackFunction(callback_func_val);
        this.theGoRequest = go_request_val;
        this.theRes = res_val;
        this.netClientOjbect().write("P" + link_id_index_val + session_id_index_val + data_val);
    };

    this.callbackFunction = function () {return this.theCallbackFunction;};
    this.clearCallbackFunction = function () {this.theCallbackFunction = 0;};
    this.setCallbackFunction = function (val)
    {
        if (this.theCallbackFunction !== 0) {
            this.abend("setCallbackFunction", this.theCallbackFunction);
        }
        this.theCallbackFunction = val;
    };

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

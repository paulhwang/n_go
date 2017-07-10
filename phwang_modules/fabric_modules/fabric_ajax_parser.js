/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: switch_module.js
 */

var the_fabric_ajax_parser_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_ajax_parser_object) {
            the_fabric_ajax_parser_object = new FabricAjaxParserClass(root_object_val);
        }
        return the_fabric_ajax_parser_object;
    },
};

function FabricAjaxParserClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.initSwitchTableArray();
        this.debug(true, "init__", "");
    };

    this.defaultLinkUpdateInterval = function () {
        return 3000;
    };

    this.debugInput = function () {
        return true;
    };

    this.debugOutput = function () {
        return false;
    };

    this.objectName = function () {
        return "FabricAjaxParserClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkMgrServiceObject = function () {
        return this.rootObject().linkMgrServiceObject();
    };

    this.ajaxObject = function () {
        return this.rootObject().ajaxObject();
    };

    this.linkUpdateInterval = function () {
        return this.theLinkUpdateInterval;
    };

    this.setLinkUpdateInterval = function (val) {
        this.theLinkUpdateInterval = val;
    };

    this.httpSwitchTableArray = function (index_val) {
        return this.theHttpSwitchTableArray[index_val];
    };

    this.initSwitchTableArray = function () {
        var post_switch_table = {
            "setup_link": this.setupLink,
            "setup_session": this.setupSession,
        };
        var get_switch_table = {
            "setup_link": this.setupLink,
            "get_link_data": this.getLinkData,
            "put_link_data": this.putLinkData,
            "get_name_list": this.getNameList,
            "setup_session": this.setupSession,
            "setup_session_reply": this.setupSessionReply,
            "get_session_data": this.getSessionData,
            "put_session_data": this.putSessionData,
            "keep_alive": this.keepAlive,
        };
        var put_switch_table = {
            "put_link_data": this.putLinkData,
            "put_session_data": this.putSessionData,
        };
        var delete_switch_table = {
            "delete_link": this.setupLink,
            "delete_session": this.setupSession,
        };
        this.theHttpSwitchTableArray = [post_switch_table,
                                        get_switch_table,
                                        put_switch_table,
                                        delete_switch_table,
                                        ];
    };

    this.parseGetRequest = function (go_request_json_val, command_index_val, res) {
        var go_request = JSON.parse(go_request_json_val);

        if (go_request.command === "get_link_data") {
            this.debug_(false, this.debugInput(), "switchRequest", "go_request_json_val=" + go_request_json_val);
        } else {
            this.debug_(true, this.debugInput(), "switchRequest", "go_request_json_val=" + go_request_json_val);
        }

        var func = this.httpSwitchTableArray(command_index_val)[go_request.command];
        if (func) {
            return func.bind(this)(go_request, res);
        } else {
            this.abend("switchRequest", "bad command=" + go_request.command);
            return null;
        }
    };

    this.setupLink = function (go_request, res) {
        this.linkMgrServiceObject().mallocLink(go_request.my_name, this.setupLinkResponse, go_request, res);
    };

    this.setupLinkResponse = function (this0, go_request, res, data_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var output = JSON.stringify({
                        my_name: go_request.my_name,
                        link_id: data_val,
                        });
        this0.debug_(true, this0.debugOutput(), "setupLinkResponse", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.getLinkData = function (go_request, res) {
        this.linkMgrServiceObject().getLinkData(go_request.link_id, this.getLinkDataResponse, go_request, res);
    };

    this.getLinkDataResponse = function (this0, go_request, res, data_val) {
        this0.debug(false, "getLinkDataResponse", "link_id=" + go_request.link_id + " my_name=" + go_request.my_name + " ajax_id=" + go_request.ajax_id);

        var c_pending_session_setup = data_val.slice(3);

        var output = JSON.stringify({
                        link_id: go_request.link_id,
                        interval: this0.linkUpdateInterval(),
                        c_data: data_val,
                        c_pending_session_setup: c_pending_session_setup, 
                        });
        this0.debug_(false, this0.debugOutput(), "getLinkDataResponse", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.putLinkData = function (go_request) {
        this.abend("putLinkData", "putLinkData is not implemented");
    };

    this.getNameList = function (go_request, res) {
        var name_list_tag = Number(go_request.name_list_tag);
        var buf = "";

        if (name_list_tag < 100) {
            buf = buf + 0;
        }
        if (name_list_tag < 10) {
            buf = buf + 0;
        }
        buf = buf + name_list_tag;

        this.linkMgrServiceObject().getNameList(go_request.link_id, buf, this.getNameListResponse, go_request, res);
    };

    this.getNameListResponse = function (this0, go_request, res, data_val) {
        var output = JSON.stringify({
                        link_id: go_request.link_id,
                        c_name_list: data_val,
                        });
        this0.debug_(true, this0.debugOutput(), "getNameList", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.setupSession = function (go_request, res) {
        this.linkMgrServiceObject().mallocSession(go_request.link_id, go_request.his_name, go_request.theme_data, this.setupSessionResponse, go_request, res);
    };

    this.setupSessionResponse = function (this0, go_request, res, data_val) {
        this0.debug(true, "setupSessionResponse", "data_val=" + data_val);

        var output = JSON.stringify({
                        link_id: go_request.link_id,
                        session_id_index: data_val,
                        his_name: go_request.his_name,
                        topic_data: go_request.topic_data,
                        });
        this0.debug_(true, this0.debugOutput(), "setupSession", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.setupSessionReply = function (go_request, res) {
        this.linkMgrServiceObject().setupSessionReply(go_request.link_id, go_request.session_id_index , this.setupSessionReplyResponse, go_request, res);
    };

    this.setupSessionReplyResponse = function (this0, go_request, res, data_val) {
        var output = JSON.stringify({
                        link_id: go_request.link_id,
                        confirm: "yes",
                        session_id_index: data_val,
                        topic_data: go_request.topic_data,
                        his_name: "tbd",
                        });
        this0.debug_(true, this0.debugOutput(), "setupSessionReply", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.getSessionData = function (go_request, res) {
        this.linkMgrServiceObject().getSessionData(go_request.link_id, go_request.session_id_index, this.getSessionDataResponse, go_request, res);
    };

    this.getSessionDataResponse = function (this0, go_request, res, data_val) {
        var link_id = data_val.slice(0, 8);
        var session_id_index = data_val.slice(8, 16);
        var c_data = data_val.slice(16);

        var output = JSON.stringify({
                        link_id: link_id,
                        session_id_index: session_id_index,
                        c_data: c_data,
                        });
        this0.debug_(true, this0.debugOutput(), "getSessionDataResponse", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.putSessionData = function (go_request, res) {
        this.linkMgrServiceObject().putSessionData(go_request.link_id, go_request.session_id_index, go_request.data, this.putSessionDataResponse, go_request, res);
    };

    this.putSessionDataResponse = function (this0, go_request, res, data_val) {
        this0.debug(true, "putSessionDataResponse", "data_val=" + data_val);

        var link_id = data_val.slice(0, 8);
        var session_id_index = data_val.slice(8, 16);
        var c_data = data_val.slice(16);

        var output = JSON.stringify({
                        link_id: link_id,
                        session_id_index: session_id_index,
                        c_data: c_data,
                        });
        this0.debug_(true, this0.debugOutput(), "getSessionData", "output=" + output);
        this0.ajaxObject().sendHttpResponse(go_request, res, output);
    };

    this.keepAlive = function (go_request, res) {
        this.abend("keepAlive", "keepAlive is not implemented");
        var my_link_id = go_request.link_id;
        this.debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + go_request.my_name);
        var link = this.linkMgrObject().searchLink(go_request.my_name, my_link_id);
        if (!link) {
            res.send(this.jsonStingifyData(go_request.command, go_request.ajax_id, null));
            this.abend("keepAlive", "***null link***" + "link_id=" + my_link_id + " my_name=" + go_request.my_name);
            return null;
        }
        return null;
    };

    this.debug_ = function (debug_val, debug_val_, str1_val, str2_val) {
        if (debug_val && debug_val_) {
            this.logit(str1_val, str2_val);
        }
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(root_object_val);
}

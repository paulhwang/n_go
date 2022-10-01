/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: http_service.js
 */

var FABRIC_PROTOCOL_DEFAULT_LINK_UPDATE_INTERNAL = 3000;

var the_http_service_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_http_service_object) {
            the_http_service_object = new HttpServiceClass(root_object_val);
        }
        return the_http_service_object;
    },
};

function HttpServiceClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.initSwitchTableArray();
        this.debug(true, "init__", "");
    };

    this.initSwitchTableArray = function () {
        var post_switch_table = {
            "setup_link": this.setupLink,
            "setup_session1": this.setupSession1,
        };
        var get_switch_table = {
            "register": this.signUpRequest,
            "login": this.setupLink,
            "logout": this.signOffRequest,
            "get_link_data": this.getLinkData,
            "put_link_data": this.putLinkData,
            "get_name_list": this.getNameList,
            "setup_session": this.setupSession,
            "setup_session1": this.setupSession1,
            "setup_session2": this.setupSession2,
            "setup_session3": this.setupSession3,
            "get_session_setup_status": this.getSessionSetupStatus,
            "get_session_data": this.getSessionData,
            "put_session_data": this.putSessionData,
            "mmw_read_data": this.mmwReadDataRequest,
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

        if ((go_request.command === "register") ||
            (go_request.command === "login") ||
            (go_request.command == "mmw_read_data")) {
        }
        else if (go_request.time_stamp !== this.fabricServiceObject().timeStampString()) {
            this.debug(true, "parseGetRequest", "***time_stamp not match: command=" + go_request.command + " time_stamp=" + go_request.time_stamp + " " + this.fabricServiceObject().timeStampString());
            var output = JSON.stringify({
                            command: go_request.command,
                            result: "50",
                            });
            this.debug(true, "signUpResponse", "output=" + output);
            this.httpInputObject().sendHttpResponse(go_request, res, output);
            return null;
        }

        if (go_request.command === "get_link_data") {
            this.debug(false, "parseGetRequest", "go_request_json_val=" + go_request_json_val);
        } else {
            this.debug(true, "parseGetRequest", "go_request_json_val=" + go_request_json_val);
        }

        var func = this.httpSwitchTableArray(command_index_val)[go_request.command];
        if (func) {
            return func.bind(this)(go_request, res);
        } else {
            this.abend("parseGetRequest", "bad command=" + go_request.command);
            return null;
        }
    };

    this.mmwReadDataRequest = function (go_request, res) {
        var act = this.encodeObject().encodeString(go_request.act);
        var data = this.encodeObject().encodeString(go_request.data);
        this.debug(true, "mmwReadDataRequest", "act=" + act + " data=" + data);

        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.mmwReadDataResponse, go_request, res);
        var act_val;
        if (act === "14init") {
            act_val = "I";
        }
        else if (act === "14read") {
            act_val = "R";
        }
        else if (act === "15write") {
            act_val = "W";
        }
        else {
            this.abend("mmwReadDataRequest", "bad act=" + act);
        }
        this.fabricServiceObject().transmitData(ajax_entry_object, "N0M" + ajax_entry_object.ajaxId() + act_val + data);
    };

    this.mmwReadDataResponse = function (this0, input_data_val, ajax_entry_object_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var current_encoded_input = data_val.slice(index);

        this0.debug(true, "mmwReadDataResponse", "input_data_val=" + input_data_val);
        this0.debug(true, "mmwReadDataResponse", "act=" + ajax_entry_object_val.act + " data=" + ajax_entry_object_val.act );

        //var encoded_data_length = this.encodeObject().encodedStringlength(current_encoded_input);
        var data = this.encodeObject().decodeString(current_encoded_input);
        this0.debug(true, "mmwReadDataResponse", "data=" + data);

        var output = JSON.stringify({
                        result: result,
                        filename: ajax_entry_object_val.filename,
                        time_stamp: this.fabricServiceObject().timeStampString(),
                        result: result,
                        data: data,
                        });
        this0.debug(true, "mmwReadDataResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.signUpRequest = function (go_request, res) {
        var my_name = this.encodeObject().encodeString(go_request.my_name);
        var password = this.encodeObject().encodeString(go_request.password);
        var email = this.encodeObject().encodeString(go_request.email);
        this.debug(true, "signUpRequest", "name=" + my_name + "password=" + password + "email=" + email);
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.signUpResponse, go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N0U" + ajax_entry_object.ajaxId() + my_name + password + email);
    };

    this.signUpResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var my_name = data_val.slice(index);

        var output = JSON.stringify({
                        my_name: ajax_entry_object_val.my_name,
                        result: result,
                        my_name: my_name,
                        });
        this0.debug(true, "signUpResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.signOffRequest = function (go_request, res) {
        this.debug(true, "signOffRequest", "link_id=" + go_request.link_id + " name=" + go_request.my_name);
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.signOffResponse, go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1O" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.my_name);
    };

    this.signOffResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();

        var encoded_my_name = data_val.slice(index);
        var my_name = encoded_my_name;//It's ok for now

        /************* not good. fix it */ this0.debug(true, "signOffResponse", "my_name=" + ajax_entry_object_val.my_name);

        var output = JSON.stringify({
                        my_name: my_name,
                        result: result,
                        link_id: link_id,
                        my_name: my_name,
                        });
        this0.debug(true, "signOffResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };


    this.setupLink = function (go_request, res) {
        var my_name = this.encodeObject().encodeString(go_request.my_name);
        var password = this.encodeObject().encodeString(go_request.password);
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.setupLinkResponse, go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N0L" + ajax_entry_object.ajaxId() + my_name + password);
    };

    this.setupLinkResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();

        var encoded_my_name = data_val.slice(index);
        var my_name = this.encodeObject().decodeString(encoded_my_name);

        var output = JSON.stringify({
                        my_name: ajax_entry_object_val.my_name,
                        time_stamp: this.fabricServiceObject().timeStampString(),
                        result: result,
                        link_id: link_id,
                        my_name: my_name,
                        });
        this0.debug(true, "setupLinkResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.getLinkData = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.getLinkDataResponse, go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1D" + ajax_entry_object.ajaxId() + go_request.link_id);
    };

    this.getLinkDataResponse = function (this0, data_val, ajax_entry_object_val) {
        var go_request = ajax_entry_object_val.ajaxRequest();
        this0.debug(false, "getLinkDataResponse", "link_id=" + go_request.link_id + " packet_id=" + go_request.packet_id);
        this0.debug(false, "getLinkDataResponse", "data_val=" + data_val);

        var result = data_val.slice(0, 2);
        var link_id = data_val.slice(2,10);
        var name_tag = data_val.slice(10, 14);
        var pending_session_setup = data_val.slice(14);
        data_val = data_val.slice(10);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        interval: this0.linkUpdateInterval(),
                        name_tag: name_tag,
                        data: data_val,
                        pending_session_setup: pending_session_setup, 
                        });
        this0.debug(false, "getLinkDataResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
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

        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.getNameListResponse, go_request, res);
        this.debug(false, "getNameList", "link_id=" + go_request.link_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1N" + ajax_entry_object.ajaxId() + go_request.link_id + buf);
    };

    this.getNameListResponse = function (this0, data_val, ajax_entry_object_val) {
        var go_request = ajax_entry_object_val.ajaxRequest();

        var result = data_val.slice(0, 2);
        var link_id = data_val.slice(2, 10);
        var name_list = data_val.slice(10);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        c_name_list: name_list,
                        });
        this0.debug(true, "getNameListResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.setupSession = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.setupSessionResponse, go_request, res);
        this.debug(true, "setupSession", "link_id=" + go_request.link_id + " peer_name=" + go_request.peer_name);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1S" + ajax_entry_object.ajaxId() + go_request.link_id 
                                              + this.encodeObject().encodeString(go_request.theme_data)
                                              + this.encodeObject().encodeString(go_request.initiator_name)
                                              + this.encodeObject().encodeString(go_request.peer_name));
    };

    this.setupSessionResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.debug(true, "setupSessionResponse", "data_val=" + data_val);

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(index, index + 8);
        index += 8;

        var encoded_theme_data = data_val.slice(index);
        var theme_data = this.encodeObject().decodeString(encoded_theme_data);
        var theme_data_len = this.encodeObject().decodeStringGetLength(encoded_theme_data);
        index += theme_data_len;

        var encoded_peer_name = data_val.slice(index);
        var peer_name = this.encodeObject().decodeString(encoded_peer_name);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        theme_data:theme_data,
                        peer_name: peer_name,
                        });
        this0.debug(true, "setupSessionResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.setupSession1 = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.setupSession1Response, go_request, res);
        this.debug(true, "setupSession1", "link_id=" + go_request.link_id + " peer_name=" + go_request.peer_name);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1X" + ajax_entry_object.ajaxId() + go_request.link_id
                                              + this.encodeObject().encodeString(go_request.theme_data)
                                              + this.encodeObject().encodeString(go_request.initiator_name)
                                              + this.encodeObject().encodeString(go_request.peer_name));
    };

    this.setupSession1Response = function (this0, data_val, ajax_entry_object_val) {
        this0.debug(true, "setupSession1Response", "data_val=" + data_val);

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(index, index + 8);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        });
        this0.debug(true, "setupSession1Response", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.setupSession2 = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.setupSession2Response, go_request, res);
        this.debug(true, "setupSession2", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2Y" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id + go_request.theme_data);
    };

    this.setupSession2Response = function (this0, data_val, ajax_entry_object_val) {
        //var go_request = ajax_entry_object_val.ajaxRequest();

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(index, index + 8);

        var output = JSON.stringify({
                        //link_id: go_request.link_id,
                        //confirm: "yes",
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        //topic_data: go_request.topic_data,
                        //his_name: "tbd",
                        });
        this0.debug(true, "setupSession2Response", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.setupSession3 = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.setupSession3Response, go_request, res);
        this.debug(true, "setupSession3", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1Z" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id);
    };

    this.setupSession3Response = function (this0, data_val, ajax_entry_object_val) {
        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(index, index + 8);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        });
        this0.debug(true, "setupSession3Response", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.getSessionSetupStatus = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.getSessionSetupStatusResponse, go_request, res);
        this.debug(true, "getSessionSetupStatus", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2T" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id);
    };

    this.getSessionSetupStatusResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.debug(true, "getSessionSetupStatusResponse", "data_val=" + data_val);

        var index = 0;
        var result = data_val.slice(index, index + 2);
        index += 2;
        var link_id = data_val.slice(index, index + this.FABRIC_DEF().LINK_ID_SIZE());
        index += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(index, index + 8);
        index += 8;
        var room_status = data_val[index++];
        var group_mode = data_val[index++];

        var encoded_theme_data = data_val.slice(index);
        var theme_data = this.encodeObject().decodeString(encoded_theme_data);
        var theme_data_len = this.encodeObject().decodeStringGetLength(encoded_theme_data);
        index += theme_data_len;

        var encoded_initiator_name = data_val.slice(index);
        var initiator_name = this.encodeObject().decodeString(encoded_initiator_name);
        var initiator_name_len = this.encodeObject().decodeStringGetLength(encoded_initiator_name);
        index += initiator_name_len;

        var encoded_peer_name = data_val.slice(index);
        var peer_name = this.encodeObject().decodeString(encoded_peer_name);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        room_status: room_status,
                        group_mode: group_mode,
                        theme_data:theme_data,
                        initiator_name: initiator_name,
                        peer_name: peer_name,
                        });
        this0.debug(true, "getSessionSetupStatusResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.getSessionData = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.getSessionDataResponse, go_request, res);
        this.debug(true, "getSessionData", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2G" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id);
    };

    this.getSessionDataResponse = function (this0, data_val, ajax_entry_object_val) {
        var current = 0;
        var result = data_val.slice(current, current + 2);
        current += 2;
        var link_id = data_val.slice(current, current + this.FABRIC_DEF().LINK_ID_SIZE());
        current += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(current, current + 8);
        current += 8;
        var data = data_val.slice(current);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        c_data: data,
                        });
        this0.debug(true, "getSessionDataResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
    };

    this.putSessionData = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(this.putSessionDataResponse, go_request, res);
        this.debug(true, "putSessionData", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id + " data=" + go_request.data);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2P" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id + go_request.data);
    };

    this.putSessionDataResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.debug(true, "putSessionDataResponse", "data_val=" + data_val);

        var current = 0;
        var result = data_val.slice(current, current + 2);
        current += 2;
        var link_id = data_val.slice(current, current + this.FABRIC_DEF().LINK_ID_SIZE());
        current += this.FABRIC_DEF().LINK_ID_SIZE();
        var session_id = data_val.slice(current, current + 8);
        current += 8;
        var data = data_val.slice(current);

        var output = JSON.stringify({
                        result: result,
                        link_id: link_id,
                        session_id: session_id,
                        data: data,
                        });
        this0.debug(true, "putSessionDataResponse", "output=" + output);
        this0.httpInputObject().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
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

    this.httpSwitchTableArray = function (index_val) {return this.theHttpSwitchTableArray[index_val];};
    this.defaultLinkUpdateInterval = function () {return FABRIC_PROTOCOL_DEFAULT_LINK_UPDATE_INTERNAL;};
    this.linkUpdateInterval = function () {return this.theLinkUpdateInterval;};
    this.setLinkUpdateInterval = function (val) {this.theLinkUpdateInterval = val;};

    this.objectName = function () {return "HttpServiceClass";};
    this.rootObject = function () {return this.theRootObject;};
    this.fabricServiceObject = function () {return this.rootObject().fabricServiceObject();};
    this.httpInputObject = function () {return this.rootObject().httpInputObject();};
    this.encodeObject = function () {return this.rootObject().encodeObject();};
    this.FABRIC_DEF = function () {return this.rootObject().FABRIC_DEF();};

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
}

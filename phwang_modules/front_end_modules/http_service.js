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
        const post_switch_table = {
            "setup_link": this.setupLink,
            "setup_session1": this.setupSession1,
        };
        const get_switch_table = {
            "register": this.registerRequest,
            "login": this.loginRequest,
            "logout": this.logoutRequest,
            "get_link_data": this.getLinkData,
            "put_link_data": this.putLinkData,
            "get_name_list": this.getNameList,
            "setup_session": this.setupSession,
            "setup_session2": this.setupSession2,
            "setup_session3": this.setupSession3,
            "get_session_data": this.getSessionData,
            "put_session_data": this.putSessionData,
            "mmw_read_data": this.mmwReadDataRequest,
            "keep_alive": this.keepAlive,
        };
        const put_switch_table = {
            "put_link_data": this.putLinkData,
            "put_session_data": this.putSessionData,
        };
        const delete_switch_table = {
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
        const go_request = JSON.parse(go_request_json_val);

        if ((go_request.command === "register") ||
            (go_request.command === "login") ||
            (go_request.command == "mmw_read_data")) {
        }
        else if (go_request.time_stamp !== this.fabricServiceObject().timeStampString()) {
            console.log("HttpServiceClass.parseGetRequest() ***time_stamp not match: command=" + go_request.command + " time_stamp=" + go_request.time_stamp + " " + this.fabricServiceObject().timeStampString());
            const output = JSON.stringify({
                            command: go_request.command,
                            result: "50",
                            });
            this.httpInputObject().sendHttpResponse(go_request, res, output);
            return null;
        }

        if (go_request.command === "get_link_data") {
            //console.log("HttpServiceClass.parseGetRequest() go_request_json_val=" + go_request_json_val);
        } else {
            console.log("HttpServiceClass.parseGetRequest() go_request_json_val=" + go_request_json_val);
        }

        const func = this.httpSwitchTableArray(command_index_val)[go_request.command];
        if (func) {
            return func.bind(this)(go_request, res);
        } else {
            console.log("HttpServiceClass.parseGetRequest() bad command=" + go_request.command);
            abend();
            return null;
        }
    };

    this.registerRequest = function (go_request, res) {
        const my_name = this.encodeObject().encodeString(go_request.my_name);
        const password = this.encodeObject().encodeString(go_request.password);
        const email = this.encodeObject().encodeString(go_request.email);
        console.log("HttpServiceClass.registerRequest() name=" + my_name + "password=" + password + "email=" + email);
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(tgo_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N0R" + ajax_entry_object.ajaxId() + my_name + password + email);
    };

    this.logoutRequest = function (go_request, res) {
        console.log("HttpServiceClass.logoutRequest() link_id=" + go_request.link_id);
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1O" + ajax_entry_object.ajaxId() + go_request.link_id);
    };

    this.loginRequest = function (go_request, res) {
        const my_name = this.encodeObject().encodeString(go_request.my_name);
        const password = this.encodeObject().encodeString(go_request.password);
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N0I" + ajax_entry_object.ajaxId() + my_name + password);
    };

    this.getLinkData = function (go_request, res) {
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1D" + ajax_entry_object.ajaxId() + go_request.link_id);
    };

    this.putLinkData = function (go_request) {
        this.abend("putLinkData", "putLinkData is not implemented");
    };

    this.getNameList = function (go_request, res) {
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.debug(false, "getNameList", "link_id=" + go_request.link_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1N" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.name_list_tag);
    };

    this.setupSession = function (go_request, res) {
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        console.log("HttpServiceClass.setupSession() link_id=" + go_request.link_id + " group_mode=" + go_request.group_mode + " theme_type=" + go_request.theme_type + " second_fiddle=" + go_request.second_fiddle);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N1S" + ajax_entry_object.ajaxId() + go_request.link_id
                                              + go_request.group_mode + go_request.theme_type
                                              + this.encodeObject().encodeString(go_request.theme_data)
                                              + this.encodeObject().encodeString(go_request.first_fiddle)
                                              + this.encodeObject().encodeString(go_request.second_fiddle));
    };

    this.setupSession2 = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.debug(true, "setupSession2", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2Y" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id + go_request.answer);
    };

    this.setupSession3 = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        this.debug(true, "setupSession3", "link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2Z" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id);
    };

    this.putSessionData = function (go_request, res) {
        const ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        console.log("HttpServiceClass.putSessionData() link_id=" + go_request.link_id + " session_id=" + go_request.session_id + " data=" + go_request.data);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2P" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id + go_request.data);
    };

    this.getSessionData = function (go_request, res) {
        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
        console.log("HttpServiceClass.getSessionData() link_id=" + go_request.link_id + " session_id=" + go_request.session_id);
        this.fabricServiceObject().transmitData(ajax_entry_object, "N2G" + ajax_entry_object.ajaxId() + go_request.link_id + go_request.session_id);
    };

    this.mmwReadDataRequest = function (go_request, res) {
        var act = this.encodeObject().encodeString(go_request.act);
        var data = this.encodeObject().encodeString(go_request.data);
        this.debug(true, "mmwReadDataRequest", "act=" + act + " data=" + data);

        var ajax_entry_object = this.fabricServiceObject().mallocAjaxEntryObject(go_request, res);
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

    this.mmwReadDataResponse = function (this0, data_val, ajax_entry_object_val) {
        this0.setLinkUpdateInterval(this0.defaultLinkUpdateInterval());

        var index = 0;
        var result = data_val.slice(index, index + this.FABRIC_DEF().RESULT_SIZE());
        index += this.FABRIC_DEF().RESULT_SIZE();
        var current_encoded_input = data_val.slice(index);

        this0.debug(true, "mmwReadDataResponse", "data_val=" + data_val);
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

    this.keepAlive = function (go_request, res) {
        this.abend("keepAlive", "keepAlive is not implemented");
        const my_link_id = go_request.link_id;
        this.debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + go_request.my_name);
        const link = this.linkMgrObject().searchLink(go_request.my_name, my_link_id);
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

    this.objectName = () => "HttpServiceClass";
    this.rootObject = () => this.theRootObject;
    this.fabricServiceObject = () => this.rootObject().fabricServiceObject();
    this.httpInputObject = () => this.rootObject().httpInputObject();
    this.encodeObject = () => this.rootObject().encodeObject();
    this.FABRIC_DEF = () => this.rootObject().FABRIC_DEF();

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_object_val);
}

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: dfabric.js
 */

let FABRIC_PROTOCOL_DEFAULT_LINK_UPDATE_INTERNAL = 3000;

let THE_DFABRIC_OJBECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_DFABRIC_OJBECT) {
            THE_DFABRIC_OJBECT = new DFabricClass(root_obj_val);
        }
        return THE_DFABRIC_OJBECT;
    },
};

function DFabricClass(root_obj_val) {
    "use strict";

    this.init__ = function (root_obj_val) {
        this.theRootObject = root_obj_val;
    };

    this.parseGetRequest = function (data_val, res) {
        let data = data_val;

        if (data.charAt(0) === '{') {
            const time_stamp = data.slice(0, 14);
            if (time_stamp !== this.uFabricObj().timeStampString()) {
                console.log("HttpServiceClass.parseGetRequest() ***time_stamp not match: data=" + data + " time_stamp=" + time_stamp + " " + this.uFabricObj().timeStampString());
                const output = JSON.stringify({
                            command: go_request.command,
                            result: "50",
                            });
                this.httpInputObject().sendHttpResponse(go_request, res, output);
                return null;
            }
            data = data.slice(14);
        }

        const command = data.charAt(1);
        if (command === "D") {
            //console.log("HttpServiceClass.parseGetRequest() data=" + data);
        } else {
            console.log("HttpServiceClass.parseGetRequest() data=" + data);
        }

        const ajax_entry_object = this.uFabricObj().mallocAjaxEntryObject(res);
        this.uFabricObj().transmitData(ajax_entry_object, ajax_entry_object.ajaxId() + data);
    };

    this.mmwReadDataRequest = function (go_request, res) {
        var act = this.encodeObject().encodeString(go_request.act);
        var data = this.encodeObject().encodeString(go_request.data);
        this.debug(true, "mmwReadDataRequest", "act=" + act + " data=" + data);

        var ajax_entry_object = this.uFabricObj().mallocAjaxEntryObject(res);
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
        this.uFabricObj().transmitData(ajax_entry_object, ajax_entry_object.ajaxId() + "0M" + act_val + data);
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
                        time_stamp: this.uFabricObj().timeStampString(),
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

    this.defaultLinkUpdateInterval = function () {return FABRIC_PROTOCOL_DEFAULT_LINK_UPDATE_INTERNAL;};
    this.linkUpdateInterval = function () {return this.theLinkUpdateInterval;};
    this.setLinkUpdateInterval = function (val) {this.theLinkUpdateInterval = val;};

    this.objectName = () => "HttpServiceClass";
    this.rootObject = () => this.theRootObject;
    this.uFabricObj = () => this.rootObject().uFabricObj();
    this.httpInputObject = () => this.rootObject().httpInputObject();
    this.encodeObject = () => this.rootObject().encodeObject();
    this.FABRIC_DEF = () => this.rootObject().FABRIC_DEF();

    this.debug = function (debug_val, str1_val, str2_val) {if (debug_val) {this.logit(str1_val, str2_val);}};
    this.logit = function (str1_val, str2_val) {this.rootObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);};
    this.abend = function (str1_val, str2_val) {this.rootObject().ABEND(this.objectName() + "." + str1_val, str2_val);};
    this.init__(root_obj_val);
}

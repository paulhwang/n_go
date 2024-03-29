/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: d_node.js
 */

let THE_D_NODE_OJBECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_D_NODE_OJBECT) {
            THE_D_NODE_OJBECT = new DNodeClass(root_obj_val);
        }
        return THE_D_NODE_OJBECT;
    },
};

function DNodeClass(root_obj_val) {
    "use strict";

    this.init__ = function (root_obj_val) {
        this.rootObj_ = root_obj_val;
    };

    this.parseReq = function (data_val, res) {
        let data = data_val;

        if ((data.charAt(0) !== '{') || (data.charAt(this.FABRIC_DEF().FABRIC_TIME_STAMP_SIZE() + 1) !== this.FABRIC_DEF().GET_LINK_DATA_COMMAND())) {
            console.log("DNodeClass.parseReq() " + data.slice(0, 50));
        } else {
            //console.log("DNodeClass.parseReq() " + data.slice(0, 50));
        }

        const ajax_entry = this.uNodeObj().mallocAjaxEntry(res);
        this.uPortObj().xmtData(ajax_entry, ajax_entry.ajaxId() + data);
    };

    this.mmwReadDataRequest = function (go_request, res) {
        var act = this.encodeObject().encodeString(go_request.act);
        var data = this.encodeObject().encodeString(go_request.data);
        this.debug(true, "mmwReadDataRequest", "act=" + act + " data=" + data);

        var ajax_entry = this.uNodeObj().mallocAjaxEntryObject(res);
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
        this.uNodeObj().transmitData(ajax_entry, ajax_entry.ajaxId() + "0M" + act_val + data);
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
                        time_stamp: this.uNodeObj().timeStampString(),
                        result: result,
                        data: data,
                        });
        this0.debug(true, "mmwReadDataResponse", "output=" + output);
        this0.dPortObj().sendHttpResponse(ajax_entry_object_val.ajaxRequest(), ajax_entry_object_val.ajaxResponse(), output);
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

    this.rootObj = () => this.rootObj_;
    this.uNodeObj = () => this.rootObj().uNodeObj();
    this.dPortObj = () => this.rootObj().dPortObj();
    this.uPortObj = () => this.rootObj().uPortObj();
    this.encodeObj = () => this.rootObj().encodeObj();
    this.FABRIC_DEF = () => this.rootObj().FABRIC_DEF();

    this.init__(root_obj_val);
}

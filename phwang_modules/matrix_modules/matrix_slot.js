/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_slot.js
 */

module.exports = {
    malloc: function (theme_object_val, slot_id_val) {
        return new MatrixSlotClass(theme_object_val, slot_id_val);
    },
};

function MatrixSlotClass (theme_object_val, slot_id_val) {
    "use strict";

    this.init__ = function (theme_object_val, slot_id_val) {
        this.theThemeObject = theme_object_val;
        this.theSlotId = slot_id_val;
        this.debug(true, "init__", "slotId=" + this.slotId());
    };

    this.objectName = function () {
        return "MatrixSlotClass";
    };

    this.themeObject = function () {
        return this.theThemeObject;
    };

    this.slotId = function () {
        return this.theSlotId;
    };

    this.rootObject = function () {
        return this.themeObject().rootObject();
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.groupMgrObject = function () {
        return this.rootObject().groupMgrObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.groupId = function () {
        return this.theGroupId;
    };

    this.setGroupId = function (val) {
        this.theGroupId = val;
    };

    this.baseId = function () {
        return this.theBaseId;
    };

    this.setBaseId = function (val) {
        this.theBaseId = val;
    };

    this.createBase = function (topic_data_val) {
        var topic_data = JSON.parse(topic_data_val);
        if (topic_data.title === "go") {
            this.setBaseId(require("../go_modules/go_base_mgr.js").malloc_base());
        }
        this.debug(true, "createBase", "slotId=" + this.slotId() + " baseId=" + this.baseId());
    };

    this.transmitData = function (data_val) {
        require("../go_modules/go_base_mgr.js").receive_data(this.baseId(), data_val);



        this.receiveData();////////////////////////////////
    };

    this.receiveData = function () {
        var data = require("../go_modules/go_base_mgr.js").transmit_data(this.baseId());//////
        var group = this.groupMgrObject().getGroup(this.groupId());
        if (group) {
            group.transmitData(data);
        }
        else {
            this.abend("transmitData", "group not found");
            return;
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

    this.init__(theme_object_val, slot_id_val);
}

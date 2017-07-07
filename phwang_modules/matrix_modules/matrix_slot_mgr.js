/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_slot_mgr.js
 */

module.exports = {
    malloc: function (theme_object_val) {
        return new MatrixSlotMgrClass(theme_object_val);
    },
};

function MatrixSlotMgrClass (theme_object_val) {
    "use strict";

    this.init__ = function (theme_object_val) {
        this.theThemeObject = theme_object_val;
        this.theGlobalSlotId = 0;
        this.theSlotIndexArray = [0];
        this.theSlotTableArray = [null];
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixSlotMgrClass";
    };

    this.themeObject = function () {
        return this.theThemeObject;
    };

    this.rootObject = function () {
        return this.themeObject().rootObject();
    };

    this.slotListObject = function () {
        return this.theSlotListObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.slotObject = function () {
        return this.rootObject().utilObject();
    };

    this.slotIndexArray = function () {
        return this.theSlotIndexArray;
    };

    this.slotTableArray = function () {
        return this.theSlotTableArray;
    };

    this.slotTableArrayLength = function () {
        return this.slotTableArray().length;
    };

    this.slotTableArrayElement = function (val) {
        return this.slotTableArray()[val];
    };

    this.globalSlotId = function () {
        return this.theGlobalSlotId;
    };

    this.incrementGlobalSlotId = function () {
        this.theGlobalSlotId += 1;
    };

    this.allocSlotId = function () {
        this.incrementGlobalSlotId();
        return this.globalSlotId();
    }

    this.addSlot = function () {
        var slot = this.importObject().importSlot().malloc(this, this.allocSlotId());
        this.slotIndexArray().push(slot.slotId());
        this.slotTableArray().push(slot);
        return slot;
    };

    this.getSlot = function (slot_id_val) {
        var index = this.slotIndexArray().indexOf(slot_id_val);
        if (index === -1) {
            return null;
        } else {
            var slot =this.slotTableArray()[index];
            return slot;
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

    this.init__(theme_object_val);
}

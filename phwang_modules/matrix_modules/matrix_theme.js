/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_theme.js
 */

module.exports = {
    malloc: function (root_object_val, theme_id_val, theme_name_val) {
        return new MatrixThemeClass(root_object_val, theme_id_val, theme_name_val);
    },
};

function MatrixThemeClass (root_object_val, theme_id_val, theme_name_val) {
    "use strict";

    this.init__ = function (root_object_val, theme_id_val, theme_name_val) {
        this.theObjectObject = root_object_val;
        this.theThemeId = theme_id_val;
        this.theThemeName = theme_name_val;
        this.theSlotMgrObject = this.importObject().importSlotMgr().malloc(this);
        this.debug(true, "init__", "themeId=" + this.themeId() + " themeName=" + this.themeName());
    };

    this.objectName = function () {
        return "MatrixThemeClass";
    };

    this.rootObject = function () {
        return this.theObjectObject;
    };

    this.themeId = function () {
        return this.theThemeId;
    };

    this.themeName = function () {
        return this.theThemeName;
    };

    this.slotMgrObject = function () {
        return this.theSlotMgrObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.addSlot = function (topic_data_val, group_id_val) {
        var slot = this.slotMgrObject().addSlot();
        slot.setGroupId(group_id_val);
        slot.createBase(topic_data_val);
        return slot.slotId();
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

    this.init__(root_object_val, theme_id_val, theme_name_val);
}

/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_theme_mgr.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new MatrixThemeMgrClass(root_object_val);
    },
};

function MatrixThemeMgrClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theThemeIndexArray = ["dummy"];
        this.theThemeTableArray = [null];
        this.createTheme("chat");
        this.createTheme("go");
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixThemeMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.themeIndexArray = function () {
        return this.theThemeIndexArray;
    };

    this.themeTableArray = function () {
        return this.theThemeTableArray;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.themeIndexArrayLength = function () {
        return this.themeIndexArray().length;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.createTheme = function (theme_name_val) {
        var theme = this.importObject().importTheme().malloc(this.rootObject(), this.themeIndexArrayLength(), theme_name_val);
        this.themeIndexArray().push(theme_name_val);
        this.themeTableArray().push(theme);
    };

    this.getTheme = function (theme_name_val) {
        var index = this.themeIndexArray().indexOf(theme_name_val);
        if (index === -1) {
            return null;
        } else {
            var theme =this.themeTableArray()[index];
            return theme;
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

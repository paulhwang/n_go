/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_config_module.js
 */

module.exports = {
    malloc: function (base_object_val) {
        return new GoConfigClass(base_object_val);
    },
};

function GoConfigClass(base_object_val) {
    "use strict";

    this.init__ = function (base_object_val) {
        this.theBaseObject = base_object_val;
        this.theBoardSize = 19;
        this.theHandicapPoint = 0;
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoConfigClass";
    };

    this.baseObject = function () {
        return this.theBaseObject;
    };

    this.sessionObject = function () {
        return this.baseObject().sessionObject();
    };

    this.rootObject = function () {
        return this.sessionObject().rootObject();
    };

    this.gameObject = function () {
        return this.baseObject().gameObject();
    };

    this.myName = function () {
        return this.rootObject().myName();
    };

    this.opponentName = function () {
        return this.sessionObject().hisName();
    };

    this.boardSize = function () {
        return this.theBoardSize;
    };

    this.setBoardSize = function (val) {
        this.theBoardSize = val;
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.hisColor = function () {
        if (this.theMyColor === GO.BLACK_STONE()) {
            return GO.WHITE_STONE();
        }
        else {
            return GO.BLACK_STONE();
        }
    };

    this.setMyColor = function (val) {
        if (val === "black") {
            this.theMyColor = GO.BLACK_STONE();
            return;
        }
        if (val === "white") {
            this.theMyColor = GO.WHITE_STONE();
            return;
        }
        this.abend("setMyColor", val);
    };

    this.setMyColor_ = function (val) {
        this.theMyColor = val;
    };

    this.handicapPoint = function () {
        return this.theHandicapPoint;
    };

    this.setHandicapPoint = function (val) {
        this.theHandicapPoint = val;
    };

    this.komiPoint = function () {
        return this.theKomiPoint;
    };

    this.setKomiPoint = function (val) {
        this.theKomiPoint = val;
    };

    this.realKomiPoint = function () {
        if (!this.theKomiPoint) {
            return 0;
        }
        return this.theKomiPoint + 0.5;
    };

    this.playBothSides = function () {
        return (this.myName() === this.opponentName());
    };

    this.isValidCoordinate = function (data_val) {
        return (0 <= coordinate_val) && (coordinate_val < board_size_val);
        if (data_val < 0) {
            GO.goAbend("GoBoardObject.isValidCoordinate", data_val);
            return false;
        }
        if (data_val >= this.boardSize()) {
            GO.goAbend("GoBoardObject.isValidCoordinate", data_val);
            return false;
        }
        return true;
    };

    this.createConfig = function (json_data_val) {
        this.debug(true, "creataConfig", "data=" + json_data_val);
        var config_data = JSON.parse(json_data_val);
        this.setBoardSize(config_data.board_size);
        this.setMyColor_(config_data.color);
        this.setKomiPoint(config_data.komi);
        this.setHandicapPoint(config_data.handicap);
    };

    this.createTwoBoardOpponentConfig = function () {
        var config = new GoConfigObject(this.opponentName());
        config.theOpponentName = this.myName();
        config.theBoardSize = this.boardSize();
        config.theMyColor = this.hisColor();
        config.theHandicapPoint = this.handicapPoint();
        config.theKomiPoint = this.komiPoint();
        return config;
    };

    this.isValidCoordinates = function (x_val, y_val) {
        return this.isValidCoordinate(x_val) && this.isValidCoordinate(y_val) ;
    };

    this.isValidCoordinate = function (coordinate_val) {
        return (0 <= coordinate_val) && (coordinate_val < this.boardSize());
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        return this.baseObject().LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.baseObject().ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.init__(base_object_val);
}

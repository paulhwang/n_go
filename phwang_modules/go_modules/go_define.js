/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_define_module.js
 */

module.exports = {
    FORWARD_MOVE: function () {return theDefineObject.FORWARD_MOVE();},
    BACKWARD_MOVE: function () {return theDefineObject.BACKWARD_MOVE();},
    DOUBLE_FORWARD_MOVE: function () {return theDefineObject.DOUBLE_FORWARD_MOVE();},
    DOUBLE_BACKWARD_MOVE: function () {return theDefineObject.DOUBLE_BACKWARD_MOVE();},
    PASS_MOVE: function () {return theDefineObject.PASS_MOVE();},
    RESIGN_MOVE: function () {return theDefineObject.RESIGN_MOVE();},
    BACK_TO_PLAY_MOVE: function () {return theDefineObject.BACK_TO_PLAY_MOVE();},
    CONFIRM_MOVE: function () {return theDefineObject.CONFIRM_MOVE();},
    PLAY_ANOTHER_GAME_MOVE: function () {return theDefineObject.PLAY_ANOTHER_GAME_MOVE();},

    EMPTY_STONE: function () {return theDefineObject.EMPTY_STONE();},
    BLACK_STONE: function () {return theDefineObject.BLACK_STONE();},
    WHITE_STONE: function () {return theDefineObject.WHITE_STONE();},
    BOTH_COLOR_STONE: function () {return theDefineObject.BOTH_COLOR_STONE();},
    MARK_DEAD_STONE_DIFF: function () {return theDefineObject.MARK_DEAD_STONE_DIFF();},
    MARK_EMPTY_STONE_DIFF: function () {return theDefineObject.MARK_EMPTY_STONE_DIFF();},

    MARKED_DEAD_BLACK_STONE: function () {return theDefineObject.MARKED_DEAD_BLACK_STONE();},
    MARKED_DEAD_WHITE_STONE: function () {return theDefineObject.MARKED_DEAD_WHITE_STONE();},
    MARKED_EMPTY_BLACK_STONE: function () {return theDefineObject.MARKED_EMPTY_BLACK_STONE();},
    MARKED_EMPTY_WHITE_STONE: function () {return theDefineObject.MARKED_EMPTY_WHITE_STONE();},

    getOppositeColor: function (color_val) {
    	return theDefineObject.getOppositeColor(color_val);
    },

    isNeighborStone: function (x1_val, y1_val, x2_val, y2_val) {
        return theDefineObject.isNeighborStone(x1_val, y1_val, x2_val, y2_val);
    },

    isValidCoordinates: function (x_val, y_val, board_size_val) {
        return theDefineObject.isValidCoordinates(x_val, y_val, board_size_val);
    },

    isValidCoordinate: function (coordinate_val, board_size_val) {
        return theDefineObject.isValidCoordinate(coordinate_val, board_size_val);
    },
};

var theDefineObject = new GoDefineObject();

function GoDefineObject () {
    "use strict";

    this.objectName = function () {
        return "GoDefineObject";
    };

    this.THE_FORWARD_MOVE = "FORWARD";
    this.THE_BACKWARD_MOVE = "BACKWARD";
    this.THE_DOUBLE_FORWARD_MOVE = "DOUBLE_FORWARD";
    this.THE_DOUBLE_BACKWARD_MOVE = "DOUBLE_BACKWARD";
    this.THE_PASS_MOVE = "PASS";
    this.THE_RESIGN_MOVE = "RESIGN";
    this.THE_BACK_TO_PLAY_MOVE = "BACK_TO_PLAY";
    this.THE_CONFIRM_MOVE = "CONFIRM";
    this.THE_PLAY_ANOTHER_GAME_MOVE = "PLAY_ANOTHER_GAME";

    this.THE_EMPTY_STONE = 0;
    this.THE_BLACK_STONE = 1;
    this.THE_WHITE_STONE = 2;
    //this.THE_BOTH_COLOR_STONE = 2;
    this.THE_MARK_DEAD_STONE_DIFF = 4;
    this.THE_MARK_EMPTY_STONE_DIFF = 6;

    this.THE_MARKED_DEAD_BLACK_STONE  = (this.THE_BLACK_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_DEAD_WHITE_STONE  = (this.THE_WHITE_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_EMPTY_BLACK_STONE = (this.THE_BLACK_STONE + this.THE_MARK_EMPTY_STONE_DIFF);
    this.THE_MARKED_EMPTY_WHITE_STONE = (this.THE_WHITE_STONE + this.THE_MARK_EMPTY_STONE_DIFF);

    this.FORWARD_MOVE = function () {return this.THE_FORWARD_MOVE;};
    this.BACKWARD_MOVE = function () {return this.THE_BACKWARD_MOVE;};
    this.DOUBLE_FORWARD_MOVE = function () {return this.THE_DOUBLE_FORWARD_MOVE;};
    this.DOUBLE_BACKWARD_MOVE = function () {return this.THE_DOUBLE_BACKWARD_MOVE;};
    this.PASS_MOVE = function () {return this.THE_PASS_MOVE;};
    this.RESIGN_MOVE = function () {return this.THE_RESIGN_MOVE;};
    this.BACK_TO_PLAY_MOVE = function () {return this.THE_BACK_TO_PLAY_MOVE;};
    this.CONFIRM_MOVE = function () {return this.THE_CONFIRM_MOVE;};
    this.PLAY_ANOTHER_GAME_MOVE = function () {return this.THE_PLAY_ANOTHER_GAME_MOVE;};

    this.EMPTY_STONE = function () {return this.THE_EMPTY_STONE;};
    this.BLACK_STONE = function () {return this.THE_BLACK_STONE;};
    this.WHITE_STONE = function () {return this.THE_WHITE_STONE;};
    //this.BOTH_COLOR_STONE = function () {return this.THE_BOTH_COLOR_STONE;};
    this.MARK_DEAD_STONE_DIFF = function () {return this.THE_MARK_DEAD_STONE_DIFF;};
    this.MARK_EMPTY_STONE_DIFF = function () {return this.THE_MARK_EMPTY_STONE_DIFF;};

    this.MARKED_DEAD_BLACK_STONE = function () {return this.THE_MARKED_DEAD_BLACK_STONE;};
    this.MARKED_DEAD_WHITE_STONE = function () {return this.THE_MARKED_DEAD_WHITE_STONE;};
    this.MARKED_EMPTY_BLACK_STONE = function () {return this.THE_MARKED_EMPTY_BLACK_STONE;};
    this.MARKED_EMPTY_WHITE_STONE = function () {return this.THE_MARKED_EMPTY_WHITE_STONE;};

    this.getOppositeColor = function (color_val) {
        switch (color_val) {
        case this.BLACK_STONE():
            return this.WHITE_STONE();

        case this.WHITE_STONE():
            return this.BLACK_STONE();

        default:
            this.goAbend("getOppositeColor", "color=" + color_val);
            return this.EMPTY_STONE();
        }
    };

    this.isNeighborStone = function (x1_val, y1_val, x2_val, y2_val) {
        if (x1_val === x2_val) {
            if ((y1_val + 1 === y2_val) || (y1_val - 1 === y2_val)) {
                return true;
            }
        }
        if (y1_val === y2_val) {
            if ((x1_val + 1 === x2_val) || (x1_val - 1 === x2_val)) {
                return true;
            }
        }
        return false;
    };
  
    this.isValidCoordinates = function (x_val, y_val, board_size_val) {
        return this.isValidCoordinate(x_val, board_size_val) && this.isValidCoordinate(y_val, board_size_val) ;
    };

    this.isValidCoordinate = function (coordinate_val, board_size_val) {
        return (0 <= coordinate_val) && (coordinate_val < board_size_val);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };
};


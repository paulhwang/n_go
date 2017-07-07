/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_base.js
 */

module.exports = {
    malloc: function (root_object_val, base_id_val) {
        return new GoBaseClass(root_object_val, base_id_val);
    },
};

function GoBaseClass (root_object_val, base_id_val) {
    "use strict";

    this.init__ = function (root_object_val, base_id_val) {
        this.theRootObject = root_object_val;
        this.theBaseId = base_id_val;
        this.theConfigObject = this.importObject().importConfig().malloc(this);
        this.theBoardObject = this.importObject().importBoard().malloc(this);
        this.theEngineObject = this.importObject().importEngine().malloc(this);
        this.theGameObject = this.importObject().importGame().malloc(this);
        this.thePortObject = this.importObject().importPort().malloc(this);
        this.debug(true, "init__", "baseId=" + this.baseId());
    };

    this.GO = function () {
       return require("./go_define.js");
    };

    this.objectName = function () {
        return "GoBaseClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.baseId = function () {
        return this.theBaseId;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.configObject = function () {
        return this.theConfigObject;
    };

    this.uiObject = function () {
        return this.theUiObject;
    };

    this.boardObject = function () {
        return this.theBoardObject;
    };

    this.engineObject = function () {
        return this.theEngineObject;
    };

    this.gameObject = function () {
        return this.theGameObject;
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.resetContainerObjectForNewGame = function () {
        this.goLog("resetContainerObjectForNewGame", "");
        this.setLastGame(0);
        this.gameObject().resetGameObjectData();
        this.boardObject().resetBoardObjectData();
        this.engineObject().resetEngineObjectData();
    };

    this.startGoGame = function () {
        this.gameObject().processTheWholeMoveList();
        this.sessionObject().setupClientReceiveCallback(function (container_val, data_val) {
            //console.log("ajaxReceiveCallBack" + port_val.objectName());
            container_val.portObject().receiveStringData(data_val);
        }, this);
    };

    this.runGoGame = function () {
        var this0 = this;
        this.startGoGame();
        this.rootObject().htmlObject().createPlayHolders();
        this.uiObject().initElements();
        this.uiObject().drawBoard(this.engineObject());

        $("canvas").on("click", function(event) {
            this0.uiObject().uiClickApi(event.clientX, event.clientY);
        });

        $("canvas").on("mousemove", function(event) {
            this0.uiObject().uiMouseMove(event.clientX, event.clientY);
        });

        var addCommentFromInputBox = function () {
            var $new_comment = $("<p>");
            if ($(".comment-input input").val() !== "") {
                $new_comment.text($(".comment-input input").val());
                $new_comment.hide();
                $(".comments").append($new_comment);
                $new_comment.fadeIn();
                $(".comment-input input").val("");
            }
        };

        $(".comment-input button").on("click", function(event) {
            addCommentFromInputBox();
        });

        $(".comment-input input").on("keypress", function(event) {
            if (event.keyCode == 13) {
                addCommentFromInputBox();
            }
        });
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function (s1_val, s2_val) {
        this.rootObject().LOG_IT(this.baseId() + ":" + s1_val, s2_val);
    };

    this.ABEND = function (s1_val, s2_val) {
        this.rootObject().ABEND(this.baseId() + ":" + s1_val, s2_val);
    };

    this.init__(root_object_val, base_id_val);
}

var GO = new GoDefineObject;
function GoDefineObject() {
    this.objectName = "GoDefineObject";

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
    this.THE_BOTH_COLOR_STONE = 2;
    this.THE_MARK_DEAD_STONE_DIFF = 4;
    this.THE_MARK_EMPTY_STONE_DIFF = 6;

    this.THE_MARKED_DEAD_BLACK_STONE  = (this.THE_BLACK_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_DEAD_WHITE_STONE  = (this.THE_WHITE_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_EMPTY_BLACK_STONE = (this.THE_BLACK_STONE + this.THE_MARK_EMPTY_STONE_DIFF);
    this.THE_MARKED_EMPTY_WHITE_STONE = (this.THE_WHITE_STONE + this.THE_MARK_EMPTY_STONE_DIFF);

    //this.X_Y_VALUE_FOR_PASS = 99;


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
    this.BOTH_COLOR_STONE = function () {return this.THE_BOTH_COLOR_STONE;};
    this.MARK_DEAD_STONE_DIFF = function () {return this.THE_MARK_DEAD_STONE_DIFF;};
    this.MARK_EMPTY_STONE_DIFF = function () {return this.THE_MARK_EMPTY_STONE_DIFF;};

    this.MARKED_DEAD_BLACK_STONE = function () {return this.THE_MARKED_DEAD_BLACK_STONE;};
    this.MARKED_DEAD_WHITE_STONE = function () {return this.THE_MARKED_DEAD_WHITE_STONE;};
    this.MARKED_EMPTY_BLACK_STONE = function () {return this.THE_MARKED_EMPTY_BLACK_STONE;};
    this.MARKED_EMPTY_WHITE_STONE = function () {return this.THE_MARKED_EMPTY_WHITE_STONE;};

//    this.X_Y_VALUE_FOR_PASS_ = function () {return this.X_Y_VALUE_FOR_PASS;}

    this.getOppositeColor = function (color_val) {
        switch (color_val) {
        case GO.BLACK_STONE():
            return GO.WHITE_STONE();

        case GO.WHITE_STONE():
            return GO.BLACK_STONE();

        default:
            this.goAbend("getOppositeColor", "color=" + color_val);
            return GO.EMPTY_STONE();
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

    this.goLog = function (s1_val, s2_val) {
        window.console.log(s1_val + "() " + s2_val);
    };

    this.goAbend = function (s1_val, s2_val) {
        window.console.log("goAbend: " + s1_val + "() " + s2_val);
        window.alert("Abend: " + s1_val + "() " + s2_val);
        var x = junk;
    };
}

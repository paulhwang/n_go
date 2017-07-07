/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_group_module.js
 */

module.exports = {
    malloc: function (group_list_val) {
        return new GoGroupClass(group_list_val);
    },
};

function GoGroupClass(group_list_val) {
    "use strict";

    this.init__ = function (group_list_val) {
        this.theGroupListObject = group_list_val;
        this.theIndexNumber = this.groupListObject().groupCount();
        this.theMyColor = this.groupListObject().myColor();
        this.theHisColor = (this.myColor() === this.GO().EMPTY_STONE())
            ? this.GO().EMPTY_STONE()
            : this.GO().getOppositeColor(this.myColor());
        this.theStoneCount = 0;
        this.theExistMatrix = this.createMatrix(this.boardSize());
        this.theDeadMatrix = this.createMatrix(this.boardSize());
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "GoGroupClass";
    };

    this.groupListObject = function () {
        return this.theGroupListObject;
    };

    this.setGroupListObject = function (group_list_val) {
        this.theGroupListObject = group_list_val;
    };

    this.baseObject = function () {
        return this.groupListObject().baseObject();
    };

    this.GO = function () {
        return this.baseObject().GO();
    };

    this.engineObject = function () {
        return this.groupListObject().engineObject();
    };

    this.configObject = function () {
        return this.baseObject().configObject();
    };

    this.boardObject = function () {
        return this.baseObject().boardObject();
    };

    this.boardSize = function () {
        return this.configObject().boardSize();
    };

    this.indexNumber = function () {
        return this.theIndexNumber;
    };

    this.setIndexNumber = function (val) {
        this.theIndexNumber = val;
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.hisColor = function () {
        return this.theHisColor;
    };

    this.stoneCount = function () {
        return this.theStoneCount;
    };

    this.maxX = function () {
        return this.theMaxX;
    };

    this.minX = function () {
        return this.theMinX;
    };

    this.maxY = function () {
        return this.theMaxY;
    };

    this.minY = function () {
        return this.theMinY;
    };

    this.setMaxX = function (val) {
        this.theMaxX = val;
    };

    this.setMinX = function (val) {
        this.theMinX = val;
    };

    this.setMaxY = function (val) {
        this.theMaxY = val;
    };

    this.setMinY = function (val) {
        this.theMinY = val;
    };

    this.incrementStoneCount = function () {
        this.theStoneCount += 1;
    };

    this.decrementStoneCount = function () {
        this.theStoneCount -= 1;
    };

    this.existMatrix = function (x_val, y_val) {
        return this.theExistMatrix[x_val][y_val];
    };

    this.deadMatrix = function (x_val, y_val) {
        return this.theDeadMatrix[x_val][y_val];
    };

    this.setExistMatrix = function (x_val, y_val, data_val) {
        this.theExistMatrix[x_val][y_val] = data_val;
        //this.printGroup();
    };

    this.setDeadMatrix = function (x_val, y_val, data_val) {
        this.theDeadMatrix[x_val][y_val] = data_val;
    };

    this.stoneExistInGroup = function (x_val, y_val) {
        return this.existMatrix(x_val, y_val);
    };

    this.insertStoneToGroup = function (x_val, y_val, dead_val) {
        this.debug(false, "insertStoneToGroup", "(" + x_val + "," + y_val + "," + this.myColor() + ")");
        if (this.existMatrix(x_val, y_val)) {
            this.abend("insertStoneToGroup", "stone (" + x_val + "," + y_val + "," + this.myColor() + ") already exists in group");
        }

        if (this.stoneCount() == 0) {
            this.setMaxX(x_val);
            this.setMinX(x_val);
            this.setMaxY(y_val);
            this.setMinY(y_val);
        } else {
            if (x_val > this.maxX()) {
                this.setMaxX(x_val);
            }
            if (x_val < this.minX()) {
                this.setMinX(x_val);
            }
            if (y_val > this.maxY()) {
                this.setMaxY(y_val);
            }
            if (y_val < this.minY()) {
                this.setMinY(y_val);
            }
        }

        this.incrementStoneCount();
        this.setExistMatrix(x_val, y_val, true);
        this.setDeadMatrix(x_val, y_val, dead_val);
    };

    this.isCandidateGroup = function (x_val, y_val) {
        this.debug(false, "isCandidateGroup", "(" + x_val + "," + y_val + ")");
        var i, j;
        i = this.minX();
        while (i <=  this.maxX()) {
            j = this.minY();
            while (j <=  this.maxY()) {
                if (this.existMatrix(i, j)) {
                    this.debug(false, "isCandidateGroup", "(" + x_val + "," + y_val + ") (" + i + "," + j + ")");
                    if (this.GO().isNeighborStone(i, j, x_val, y_val)) {
                        return true;
                    }
                }
                j += 1;
            }
            i += 1;
        }
        return false;
    };

    this.mergeWithOtherGroup = function (group2) {
        this.debug(false, "mergeWithOtherGroup", "");
        //this.debugGroupObject();

        var i = group2.minX();
        while (i <= group2.maxX()) {
            var j = group2.minY();
            while (j <= group2.maxY()) {
                if (group2.existMatrix(i, j)) {
                    this.debug(false, "mergeWithOtherGroup", "i=" + i + " j=" + j);
                    if (this.existMatrix(i, j)) {
                        this.abend("mergeWithOtherGroup", "already exist");
                    }
                    this.setExistMatrix(i, j, group2.existMatrix(i, j));
                    this.incrementStoneCount();

                    group2.setExistMatrix(i, j, false);
                    group2.decrementStoneCount();
                }
                j += 1;
            }
            i += 1;
        }
        //this.debugGroupObject();

        if (this.maxX() < group2.maxX()) {
            this.setMaxX(group2.maxX());
        }
        if (this.minX() > group2.minX()) {
            this.setMinX(group2.minX());
        }
        if (this.maxY() < group2.maxY()) {
            this.setMaxY(group2.maxY());
        }
        if (this.minY() > group2.minY()) {
            this.setMinY(group2.minY());
        }

        if (group2.groupListObject().listArray(group2.indexNumber()) != group2) {
            this.abend("mergeWithOtherGroup", "group2");
        }
    };

    this.groupHasAir = function () {
        //goDebug("GoGroupObject.groupHasAir", "color=" + this.myColor_() + " count=" + this.stoneCount_());
        var i, j;
        i = this.minX();
        while (i <= this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                //goDebug("GoGroupObject.groupHasAir", "(" + i + "," + j + ")");
                if (this.existMatrix(i, j)) {
                    //goDebug("GoGroupObject.groupHasAir", "(" + i + "," + j + ")");
                    if (this.engineObject().stoneHasAir(i, j)) {
                        //goDebug("GoGroupObject.groupHasAir", "(" + i + "," + j + ")");
                        return true;
                    }
                }
                j += 1;
            }
            i += 1;
        }
        return false;
    };

    this.removeDeadStoneFromBoard = function () {
        var i, j;

        i = this.minX();
        while (i <= this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    this.boardObject().setBoardArray(i, j, this.GO().EMPTY_STONE());
                    this.debug(false, "removeDeadStoneFromBoard", "(" + i + "," + j + ")");
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.scoreOneEmptyGroup = function () {
        var color = this.GO().EMPTY_STONE();
        var i, j;

        i = this.minX();
        while (i <=  this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    color |= this.scoreOneEmptyStone(i, j);
                 }
                j += 1;
            }
            i += 1;
        }
        this.debug(true, "scoreOneEmptyGroup", "color=" + color);
        return color;
    }

    this.drawOneEmptyGroup = function () {
        var i, j;

        i = this.minX();
        while (i <=  this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    this.containerObject().uiObject().drawOneStoneMark(i, j, this.groupListObject().smallStoneColor());
                }
                j += 1;
            }
            i += 1;
        }
    }

    this.scoreOneEmptyStone = function (x_val, y_val) {
        var color = this.GO().EMPTY_STONE();
        color |= this.scoreOneEmptyStoneTask(x_val, y_val - 1)
        color |= this.scoreOneEmptyStoneTask(x_val, y_val + 1)
        color |= this.scoreOneEmptyStoneTask(x_val - 1, y_val)
        color |= this.scoreOneEmptyStoneTask(x_val + 1, y_val)
        return color;        
    }

    this.scoreOneEmptyStoneTask = function (x_val, y_val) {
        //this.goLog("scoreOneEmptyStoneTask", "(" + x_val + "," + y_val + ")");
        var color = this.GO().EMPTY_STONE();
        if (this.configObject().isValidCoordinates(x_val, y_val)) {
            color |= this.boardObject().boardArray(x_val, y_val);
            //this.goLog("scoreOneEmptyStoneTask", "color=" + color);
            if (color & this.GO().MARK_DEAD_STONE_DIFF()) {
                color = this.GO().getOppositeColor(color - this.GO().MARK_DEAD_STONE_DIFF());
            }
        }
        return color;        
    }

    this.scoreAnEmptyGroup = function () {
        var i, j;

        this.score_color = this.emptyGroupFindNeighborsColor();
        if (this.score_color == this.GO().EMPTY_STONE) {
            this.abend("scoreAnEmptyGroup", " " + this.index + " " + this.stone_count);
            return;
        }

        i = this.x_min;
        while (i <=  this.x_max) {
            j = this.y_min;
            while (j <=  this.y_max) {
                if (this.exist_matrix[i][j]) {
                      if (!this.dead_matrix[i][j]) {
                          this.boardObject().board[i][j] = this.score_color + this.GO().GO_MARK_EMPTY_STONE_DIFF;
                      }
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.emptyGroupFindNeighborsColor = function () {
        this.goLog("emptyGroupFindNeighborsColor", "");

        var c = this.GO().EMPTY_STONE();
        var c1;
        var i, j;

        i = this.minX();
        while (i <= this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    c1 = this.emptyStoneFindNeighborsColor(i, j);
                    if (c1 === this.GO().EMPTY_STONE()) {
                        this.abend("emptyGroupFindNeighborsColor", "empty");
                        return;
                    }

                    if (c === this.GO().EMPTY_STONE()) {
                        if ((c1 & this.GO().MARK_DEAD_STONE_DIFF()) != 0) {
                            c = this.GO().get_opposite_color(c1 - this.GO().MARK_DEAD_STONE_DIFF());
                            continue;
                        }
                        c = c1;
                        continue;
                    }
                    if (c !== c1) {
                        if ((c1 & this.GO().GO_MARK_DEAD_STONE_DIFF()) !== 0) {
                            if (c !== GoDefine.get_opposite_color(c1 - this.GO().MARK_DEAD_STONE_DIFF())) {
                                return this.GO().EMPTY_STONE();
                            }
                        }
                    return this.GO().EMPTY_STONE();
                    }
                }
                j += 1;
            }
            i += 1;
        }
        return c;
    };

    this.emptyStoneFindNeighborsColor = function (x_val, y_val) {
        this.goLog("emptyStoneFindNeighborsColor", "");
        /*
        var color_array1 = [4];
        var c = GoDefine.GO_EMPTY_STONE;
        var i;

        color_array1[0] = this.empty_stone_find_neighbor_color(x_val,     y_val - 1);
        color_array1[1] = this.empty_stone_find_neighbor_color(x_val,     y_val + 1);
        color_array1[2] = this.empty_stone_find_neighbor_color(x_val - 1, y_val);
        color_array1[3] = this.empty_stone_find_neighbor_color(x_val + 1, y_val);

        i = 0;
        while (i < 4) {
            if (color_array1[i] != GoDefine.GO_EMPTY_STONE) {
                if (c == GoDefine.GO_EMPTY_STONE) {
                    if ((color_array1[i] & GoDefine.GO_MARK_DEAD_STONE_DIFF) != 0) {
                        c = GoDefine.get_opposite_color(color_array1[i] - GoDefine.GO_MARK_DEAD_STONE_DIFF);
                        continue;
                    }
                    c = color_array1[i];
                    continue;
                }
                if (c != color_array1[i]) {
                    if ((color_array1[i] & GoDefine.GO_MARK_DEAD_STONE_DIFF) != 0) {
                        if (c != GoDefine.get_opposite_color(color_array1[i] - GoDefine.GO_MARK_DEAD_STONE_DIFF)) {
                            return GoDefine.GO_EMPTY_STONE;
                        }
                    }
                    return GoDefine.GO_EMPTY_STONE;
                }
            }
            i += 1;
        }
        return c;
        */
    };

    this.changeMarkInGroup = function (add_mark_val) {
        var i, j;

        i = this.minX();
        while (i <= this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    //this.goLog("changeMarkInGroup", "(" + i + "," + j + ") " + add_mark_val);
                    if (add_mark_val) {
                        if (!(this.boardObject().boardArray(i, j) & this.GO().MARK_DEAD_STONE_DIFF())) {
                            //this.goLog("changeMarkInGroup", "add (" + i + "," + j + ")");
                            this.boardObject().setBoardArray(i, j,  this.boardObject().boardArray(i, j) + this.GO().MARK_DEAD_STONE_DIFF());
                            //GO.goLog("GoEngineObject.markDeadGroup", "(" + i + "," + j + ")=" + this.boardObject().boardArray_1(i, j));
                        }
                        else {
                            this.abend("changeMarkInGroup", "add");
                        }
                    }
                    else {
                        if (this.boardObject().boardArray(i, j) & this.GO().MARK_DEAD_STONE_DIFF()) {
                            //this.goLog("changeMarkInGroup", "remove (" + i + "," + j + ")");
                            this.boardObject().setBoardArray(i, j,  this.boardObject().boardArray(i, j) - this.GO().MARK_DEAD_STONE_DIFF());
                            //GO.goLog("GoEngineObject.markDeadGroup", "(" + i + "," + j + ")=" + this.boardObject().boardArray_1(i, j));
                        }
                         else {
                            this.abend("changeMarkInGroup", "remove");
                        }
                   }
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.removeMarkFromGroup_fjsfjsdlfjsd = function () {
        var i, j;

        i = this.minX();
        while (i <= this.maxX()) {
            j = this.minY();
            while (j <= this.maxY()) {
                if (this.existMatrix(i, j)) {
                    this.debug(true, "removeMarkFromGroup", "(" + i + "," + j + ")");
                    if (this.boardObject().boardArray(i, j) & this.GO().MARK_DEAD_STONE_DIFF()) {
                        this.debug(true, "removeMarkFromGroup", "(" + i + "," + j + ")");
                        this.boardObject().setBoardArray(i, j,  this.boardObject().boardArray(i, j) - this.GO().MARK_DEAD_STONE_DIFF());
                        //GO.goLog("GoEngineObject.markDeadGroup", "(" + i + "," + j + ")=" + this.boardObject().boardArray_1(i, j));
                    }
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.stoneExistWithinMe = function (x_val, y_val) {
        return this.existMatrix(x_val, y_val);
    };

    this.abendGroup = function () {
        this.debug(false, "abendGroup", "group=(" + this.myColor() + ":" + this.indexNumber() + ":" + this.stoneCount()  + ")");
        var count = 0;

        var i = 0;
        while (i < this.boardSize()) {
            var j = 0;
            while (j < this.boardSize()) {
                if (this.existMatrix(i, j)) {
                    //this.goLog("abendGroup", "(" + i + "," + j + ") color=" + this.myColor());
                    count++;
                }
                j += 1;
            }
            i += 1;
        }
        //this.goLog("abendGroup", this.stoneCount_() + "==" + count);
        if (this.stoneCount() !== count) {
            this.printGroup();
            this.abend("abendGroup", this.stoneCount() + "!=" + count);
        }
        //this.printGroup();
    };

    this.abendOnGroupConflict = function(other_group_val) {
        this.debug(false, "abendOnGroupConflict", this.indexNumber() + " vs " + other_group_val.indexNumber());
        var i = 0;
        while (i < this.boardSize()) {
            var j = 0;
            while (j < this.boardSize()) {
                if (this.existMatrix(i, j)) {
                    if (other_group_val.existMatrix(i, j)) {
                        this.abend("abendOnGroupConflict", "stone (" + i + "," + j + ") exists in 2 groups: (" + this.myColor() + ":" + this.indexNumber() + ":" + this.stoneCount() + ") ("
                            + other_group_val.myColor() + ":" + other_group_val.indexNumber() + ":" + other_group_val.stoneCount() + ")");
                    }
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.printGroup = function () {
        var s = "color=" + this.myColor() + " index=" + this.indexNumber() + " count=" + this.stoneCount();
        for (var i = 0; i < this.boardSize(); i++) {
            for (var j = 0; j < this.boardSize(); j++) {
                if (this.existMatrix_1(i, j)) {
                    s += " (" + i + "," + j + ")";
                }
            }
        }
        this.debug(true, "printGroup", s);
    };

    this.createMatrix = function (board_size_val) {
        var matrix = new Array(board_size_val);
        var i = 0;
        while (i < board_size_val) {
            matrix[i] = new Array(board_size_val);
            i += 1;
        }
        return matrix;
    }

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

    this.init__(group_list_val);
}


/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_group_list_module.js
 */

module.exports = {
    malloc: function (engine_val, index_val, color_val, dead_val, big_stone_val, small_stone_val) {
        return new GoGroupListClass(engine_val, index_val, color_val, dead_val, big_stone_val, small_stone_val);
    },
};

function GoGroupListClass(engine_val, index_val, color_val, dead_val, big_stone_val, small_stone_val) {
    "use strict";

    this.init__ = function (engine_val, index_val, color_val, dead_val, big_stone_val, small_stone_val) {
        this.theEngineObject = engine_val;
        this.theIndexNumber = index_val;
        this.theMyColor = color_val;
        this.theHisColor = (this.myColor() === this.GO().EMPTY_STONE())
            ? this.GO().EMPTY_STONE()
            : this.GO().getOppositeColor(this.myColor());
        this.theIsDead = dead_val;
        this.theBigStoneColor = big_stone_val;
        this.theSmallStoneColor = small_stone_val;
        this.theGroupCount = 0;
        this.theIsMarkedDead = false;
        this.theListArray = [];
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "GoGroupListClass";
    };

    this.GO = function () {
        return this.baseObject().GO();
    };

    this.engineObject = function () {
        return this.theEngineObject;
    };

    this.baseObject = function () {
        return this.engineObject().baseObject();
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.hisColor = function () {
        return this.theHisColor;
    };

    this.indexNumber = function () {
        return this.theIndexNumber;
    };

    this.isDead = function () {
        return this.theIsDead;
    };
    
    this.bigStoneColor = function () {
        return this.theBigStoneColor;
    }
    
    this.smallStoneColor = function () {
        return this.theSmallStoneColor;
    }

    this.groupCount = function () {
        return this.theGroupCount;
    };

    this.totalStoneCount = function () {
        var count = 0;
        var i = 0;
        while (i < this.groupCount()) {
            count += this.listArray(i).stoneCount();
            i += 1;
        }
        return count;
    };


    this.listArray = function (index_val) {
        return this.theListArray[index_val];
    };

    this.setListArray = function (index_val, data_val) {
        this.theListArray[index_val] = data_val;
    };

    this.incrementGroupCount = function () {
        this.theGroupCount += 1;
    };

    this.decrementGroupCount = function () {
        this.theGroupCount -= 1;
    };

    this.insertGroupToGroupList = function (group_val) {
        this.setListArray(this.groupCount(), group_val);
        group_val.setIndexNumber(this.groupCount());
        this.incrementGroupCount();
        group_val.setGroupListObject(this);
    };

    this.removeGroupFromGroupList = function (group_val) {
        this.decrementGroupCount();

        if (group_val.indexNumber() != this.groupCount()) {
            this.listArray(this.groupCount()).setIndexNumber(group_val.indexNumber());
            this.setListArray(group_val.indexNumber(), this.listArray(this.groupCount()));
        }

        this.setListArray(this.groupCount(), null);
    };

    this.findCandidateGroup = function (x_val, y_val) {
        //goDebug("GoGroupListObject.findCandidateGroup", "(" + move_val.xX_() + "," + move_val.yY_() + ")");
        var i = 0;
        while (i < this.groupCount()) {
            //GO.goLog("GoGroupListObject.findCandidateGroup", "(" + x_val + "," + y_val + ")");
            if (this.listArray(i).isCandidateGroup(x_val, y_val)) {
                return this.listArray(i);
            }
            i += 1;
        }
        //GO.goLog("GoGroupListObject.findCandidateGroup", "not found");
        return null;
    };

    this.findOtherCandidateGroup = function (group_val, x_val, y_val) {
        var i = 0;
        while (i < this.groupCount()) {
            if (this.listArray(i) != group_val) {
                if (this.listArray(i).isCandidateGroup(x_val, y_val)) {
                    return this.listArray(i);
                }
            }
            i += 1;
        }
        return null;
    };

    this.removeOneDeadGroup = function (group_val) {
        this.removeGroupFromGroupList(group_val);
    };

    this.stoneExistInGroupList = function (x_val, y_val) {
        var i = 0;
        while (i < this.groupCount()) {
            if (this.listArray(i).stoneExistInGroup(x_val, y_val)) {
                return true;
            }
            i += 1;
        }
        return false;
    };

    this.insertStoneToEmptyGroupList = function (x_val, y_val, dead_val) {
        var exist_group1;

        //this.logIt("insert_stone_to_group_list", "color=" + Integer.toString(this.my_color));

        this.total_stone_count += 1;

        exist_group1 = this.findCandidateGroup(x_val, y_val);
        if (exist_group1 == null) {
            var new_group1 = this.engineObject().mallocGroup(this);
            new_group1.insertStoneToGroup(x_val, y_val, dead_val);

            this.setListArray(this.groupCount(), new_group1);
            this.incrementGroupCount();

            //this.check_error(false);
            //Log.d(TAG, "new group");
            return new_group1;
        }

        //Log.d(TAG, "Got candidate group: " + Integer.toString(exist_group1.index) + " count=" + Integer.toString(exist_group1.stone_count));
        exist_group1.insertStoneToGroup(x_val, y_val, dead_val);

        var dummy_count = 0;
        var exist_group2;
        while (true) {
            exist_group2 = this.findOtherCandidateGroup(exist_group1, x_val, y_val);
            if (exist_group2 == null) {
                break;
            }
            dummy_count += 1;
            //Log.d(TAG, "Got other candidate group: " + Integer.toString(g1.index));

            exist_group1.mergeWithOtherGroup(exist_group2);

            this.removeGroupFromGroupList(exist_group2);
        }

        if (dummy_count > 3) {
            this.goAbend("insert_stone_to_group_list", "dummy_count");
        }

        return exist_group1;
    };

    this.drawOneEmptyGroupList = function () {
        var group;
        var i = 0;
        while (i < this.groupCount()) {
            this.listArray(i).drawOneEmptyGroup();
            i += 1;
        }
    };

    this.stoneExistWithinMe = function (x_val, y_val) {
        var i = 0;
        while (i < this.groupCount()) {
            var group = this.listArray(i);
            if (group.stoneExistWithinMe(x_val, y_val)) {
                return true;
            }
            i += 1;
        }
        return false;
    };

    this.abendGroupList = function () {
        var d;
        if (this.isDead()) {
            d = "d* ";
        } else {
            d = "*";
        }

        this.debug(false, "abendGroupList", "" + this.indexNumber() + " color=" + this.myColor() + " count=" + this.groupCount() + ":" + this.totalStoneCount());
        var i = 0;
        while (i < this.groupCount()) {
            var group = this.listArray(i);
            if (!group) {
                this.goAbend("abendGroupList", "null group " + this.groupCount() + " " + i);
                return;
            }
            if (group.groupListObject() != this) {
                this.goAbend("abendGroupList", "groupListObject");
                return;
            }
            if (group.indexNumber() != i) {
                this.goAbend("abendGroupList", "index " + group.indexNumber() + "!=" + i);
                return;
            }

            group.abendGroup();

            var j = i + 1;
            while (j < this.groupCount()) {
                group.abendOnGroupConflict(this.listArray(j));
                j = j + 1;
            }

            i += 1;
        }
    };

    this.printGroupList = function () {
        var d;
        if (this.isDead_()) {
            d = "d* ";
        } else {
            d = "d";
        }

        this.goLog("printGroupList", "sfjfsj" + d + "color=" + this.myColor_() + " count=" + this.groupCount() + ":" + this.totalStoneCount_to_be_rename());
        var i = 0;
        while (i < this.groupCount()) {
            this.listArray(i).printGroup();
            i += 1;
        }
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

    this.init__(engine_val, index_val, color_val, dead_val, big_stone_val, small_stone_val);
}

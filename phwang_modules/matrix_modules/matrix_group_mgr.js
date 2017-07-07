/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group_mgr.js
 */

var the_matrix_group_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_matrix_group_mgr_object) {
            the_matrix_group_mgr_object = new MatrixGroupMgrClass(root_object_val);
        }
        return the_matrix_group_mgr_object;
    },

    malloc_group: function (cluster_id_val, topic_data_val) {
        return the_matrix_group_mgr_object.mallocGroup(cluster_id_val, topic_data_val);
    },

    receive_data: function (group_id_val, data_val) {
        the_matrix_group_mgr_object.receiveData(group_id_val, data_val);
    },
};

function MatrixGroupMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalGroupId = 0;
        this.theGroupIndexArray = [0];
        this.theGroupTableArray = [null];
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixGroupMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.groupIndexArray = function () {
        return this.theGroupIndexArray;
    };

    this.groupTableArray = function () {
        return this.theGroupTableArray;
    };

    this.groupTableArrayLength = function () {
        return this.groupTableArray().length;
    };

    this.groupTableArrayElement = function (val) {
        return this.groupTableArray()[val];
    };

    this.globalGroupId = function () {
        return this.theGlobalGroupId;
    };

    this.incrementGlobalGroupId = function () {
        this.theGlobalGroupId += 1;
    };

    this.allocGroupId = function () {
        this.incrementGlobalGroupId();
        return this.globalGroupId();
    }

    this.mallocGroup = function (cluster_id_val, topic_data_val) {
        var group = this.importObject().importGroup().malloc(this.rootObject(), this.allocGroupId(), cluster_id_val, topic_data_val);
        this.groupIndexArray().push(group.groupId());
        this.groupTableArray().push(group);
        return group.groupId();
    };

    this.getGroup = function (group_id_val) {
        var index = this.groupIndexArray().indexOf(group_id_val);
        if (index === -1) {
            return null;
        } else {
            var group =this.groupTableArray()[index];
            return group;
        }
    };

    this.receiveData = function (group_id_val, data_val) {
        var group = this.getGroup(group_id_val);
        if (!group) {
            return;
        }
        group.receiveData(data_val);
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


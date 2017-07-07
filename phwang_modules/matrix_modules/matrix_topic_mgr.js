/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_topic_mgr.js
 */

module.exports = {
    malloc: function (group_object_val) {
        return new MatrixTopicMgrClass(group_object_val);
    },
};

function MatrixTopicMgrClass (group_object_val) {
    "use strict";

    this.init__ = function (group_object_val) {
        this.theGroupObject = group_object_val;
        this.theGlobalTopicId = 0;
        this.theTopicIndexArray = ["dummy"];
        this.theTopicTableArray = [null];
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "MatrixTopicMgrClass";
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.topicIndexArray = function () {
        return this.theTopicIndexArray;
    };

    this.topicTableArray = function () {
        return this.theTopicTableArray;
    };

    this.rootObject = function () {
        return this.groupObject().rootObject();
    };

    this.topicListObject = function () {
        return this.theTopicListObject;
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

    this.topicIndexArray = function () {
        return this.theTopicIndexArray;
    };

    this.topicTableArray = function () {
        return this.theTopicTableArray;
    };

    this.topicTableArrayLength = function () {
        return this.topicTableArray().length;
    };

    this.topicTableArrayElement = function (val) {
        return this.topicTableArray()[val];
    };

    this.globalTopicId = function () {
        return this.theGlobalTopicId;
    };

    this.incrementGlobalTopicId = function () {
        this.theGlobalTopicId += 1;
    };

    this.allocTopicId = function () {
        this.incrementGlobalTopicId();
        return this.globalTopicId();
    }

    this.addTopic = function (topic_data_val) {
        var topic = this.importObject().importTopic().malloc(this.groupObject(), this.allocTopicId(), "go");
        this.topicIndexArray().push("go");/////////////////////////topic.topicId());
        this.topicTableArray().push(topic);
        return topic;
    };

    this.getTopic = function (topic_id_val, topic_name_val) {
        var index = this.topicIndexArray().indexOf(topic_name_val);
        if (index === -1) {
            return null;
        } else {
            var topic =this.topicTableArray()[index];
            return topic;
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

    this.init__(group_object_val);
}

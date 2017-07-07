/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_topic.js
 */

module.exports = {
    malloc: function (group_object_val, topic_id_val, topic_name_val) {
        return new MatrixTopicClass(group_object_val, topic_id_val, topic_name_val);
    },
};

function MatrixTopicClass (group_object_val, topic_id_val, topic_name_val) {
    "use strict";

    this.init__ = function (group_object_val, topic_id_val, topic_name_val) {
        this.theGroupObject = group_object_val;
        this.theTopicId = topic_id_val;
        this.theTopicName = topic_name_val;
        this.theSLotId = 0;
        this.debug(true, "init__", "topicId=" + this.topicId() + " topicName=" + this.topicName());
    };

    this.objectName = function () {
        return "MatrixTopicClass";
    };

    this.groupObject = function () {
        return this.theGroupObject;
    };

    this.topicId = function () {
        return this.theTopicId;
    };

    this.topicName = function () {
        return this.theTopicName;
    };

    this.rootObject = function () {
        return this.groupObject().rootObject();
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

    this.slotId = function () {
        return this.theSLotId;
    };

    this.setSlotId = function (val) {
        this.theSLotId = val;
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

    this.init__(group_object_val, topic_id_val, topic_name_val);
}

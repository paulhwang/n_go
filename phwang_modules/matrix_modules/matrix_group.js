/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: matrix_group.js
 */

module.exports = {
    malloc: function (root_object_val, group_id_val, topic_data_val, cluster_id_val) {
        return new MatrixGroupObject(root_object_val, group_id_val, topic_data_val, cluster_id_val);
    },
};

function MatrixGroupObject (root_object_val, group_id_val, cluster_id_val, topic_data_val) {
    "use strict";

    this.init__ = function (root_object_val, group_id_val, cluster_id_val, topic_data_val) {
        this.theRootObject = root_object_val;
        this.theGroupId = group_id_val;
        this.theClusterId = cluster_id_val;
        this.theTopicMgrObject = this.importObject().importTopicMgr().malloc(this);
        this.theTransmitQueue = this.importObject().mallocQueue();
        this.addTopic(topic_data_val);
        this.debug(false, "init__", "groupId=" + this.groupId());
    };

    this.goObjectMalloc = function () {
        var go_module = require("./../go_modules/go_base.js")
        return go_module.malloc(this);
    },

    this.objectName = function () {
        return "MatrixGroupObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.groupId = function () {
        return this.theGroupId;
    };

    this.clusterId = function () {
        return this.theClusterId;
    };

    this.themeMgrObject = function () {
        return this.rootObject().themeMgrObject();
    };

    this.topicListObject = function () {
        return this.topicMgrObject().topicListObject();
    };

    this.topicMgrObject = function () {
        return this.theTopicMgrObject;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.topicObject = function () {
        return this.theTopicObject;
    };

    this.setTopicObject = function (val) {
        this.theTopicObject = val;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.addTopic = function (topic_data_val) {
        var theme = this.themeMgrObject().getTheme("go");
        if (!theme) {
            this.abend("addTopic", "theme is not found");
            return;
        }

        var topic = this.topicMgrObject().addTopic();
        topic.setSlotId(theme.addSlot(topic_data_val, this.groupId()));
        this.debug(true, "addTopic", "slotId=" + topic.slotId());
    };

    this.enqueueTransmitData = function (data_val) {
        this.debug(false, "enqueueTransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
    };

    this.dequeueTransmitData = function () {
        var data = this.transmitQueue().deQueue();
        this.debug(false, "dequeueTransmitData", data);
        return data;
    };

    this.processSetupTopicData = function (json_data_val) {
        this.debug(true, "processSetupTopicData", "data=" + json_data_val);
        var topic_data = JSON.parse(json_data_val);
        if (topic_data.command === "config") {
            this.topicObject().configObject().createConfig(topic_data.data);
        }
    };

    this.receiveData = function (data_val) {
        var topic = this.topicMgrObject().getTopic(0, "go");
        if (!topic) {
            this.abend("receiveData", "topic is not found");
            return;
        }

        var theme = this.themeMgrObject().getTheme("go");
        if (!theme) {
            this.abend("receiveData", "theme is not found");
            return;
        }

        var slot = theme.slotMgrObject().getSlot(topic.slotId());
        if (!slot) {
            this.abend("receiveData", "slot is not found");
            return;
        }
        slot.transmitData(data_val);
    };

    this.transmitData = function (data_val) {
        require("../fabric_modules/fabric_cluster_mgr.js").receive_data(this.clusterId(), data_val);
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

    this.init__(root_object_val, group_id_val, cluster_id_val, topic_data_val);
}

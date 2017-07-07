/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_cluster.js
 */

module.exports = {
    malloc: function (root_object_val, cluster_id_val) {
        return new FabricClusterClass(root_object_val, cluster_id_val);
    },
};

function FabricClusterClass(root_object_val, cluster_id_val) {
    "use strict";

    this.init__ = function (root_object_val, cluster_id_val) {
        this.theRootObject  = root_object_val;
        this.theClusterId = cluster_id_val;
        this.theGroupId = 0;
        this.theSessionArray = [2];
        this.theSessionArrayLength = 0;
        this.theTransmitQueue = this.importObject().mallocQueue();
        this.debug(true, "init__", "clusterId=" + this.clusterId());
    };

    this.objectName = function () {
        return "FabricClusterClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.clusterId = function () {
        return this.theClusterId;
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.importListMgr = function () {
        return this.importObject().importListMgr();
    };

    this.groupId = function () {
        return this.theGroupId;
    };

    this.setGroupId = function (val) {
        this.theGroupId = val;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.sessionArray = function (index_val) {
        return this.theSessionArray[index_val];
    };

    this.sessionArrayLength = function () {
        return this.theSessionArrayLength;
    };

    this.incrementSessionArrayLength = function () {
        this.theSessionArrayLength += 1;
    };

    this.addSession = function (session_val) {
        this.theSessionArray[this.sessionArrayLength()] = session_val;
        this.incrementSessionArrayLength();
    };


    this.TransmitData = function (data_val) {
        this.debug(false, "TransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
        while (true) {
            var data = this.transmitQueue().deQueue();
            if (!data) {
                return;
            }
            require("../matrix_modules/matrix_group_mgr.js").receive_data(this.groupId(), data);
        }
    };

    this.receiveData = function (data_val) {
        this.debug(false, "receiveData", "data_val=" + data_val);
        var i = 0;
        while (i < this.sessionArrayLength()) {
            this.sessionArray(i).enqueueTransmitData(data_val);
            i += 1;
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

    this.init__(root_object_val, cluster_id_val);
}

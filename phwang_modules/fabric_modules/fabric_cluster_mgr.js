/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_cluster_mgr.js
 */

var the_fabric_cluster_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_fabric_cluster_mgr_object) {
            the_fabric_cluster_mgr_object = new FabricClusterMgrClass(root_object_val);
        }
        return the_fabric_cluster_mgr_object;
    },

    receive_data: function (cluster_id_val, data_val) {
        the_fabric_cluster_mgr_object.receiveData(cluster_id_val, data_val);
    },
};

function FabricClusterMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalClusterId = 0;
        this.theClusterIndexArray = [0];
        this.theClusterTableArray = [null];
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "FabricClusterMgrClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.importObject = function () {
        return this.rootObject().importObject();
    };

    this.clusterIndexArray = function () {
        return this.theClusterIndexArray;
    };

    this.clusterTableArray = function () {
        return this.theClusterTableArray;
    };

    this.clusterTableArrayLength = function () {
        return this.clusterTableArray().length;
    };

    this.clusterTableArrayElement = function (val) {
        return this.clusterTableArray()[val];
    };

    this.globalClusterId = function () {
        return this.theGlobalClusterId;
    };

    this.incrementGlobalClusterId = function () {
        this.theGlobalClusterId += 1;
    };

    this.allocClusterId = function () {
        this.incrementGlobalClusterId();
        return this.globalClusterId();
    }

    this.mallocCluster = function (topic_data_val) {
        var cluster = this.importObject().importCluster().malloc(this.rootObject(), this.allocClusterId());
        this.clusterIndexArray().push(cluster.clusterId());
        this.clusterTableArray().push(cluster);
        cluster.setGroupId(require("../matrix_modules/matrix_group_mgr.js").malloc_group(cluster.clusterId(), topic_data_val));
        return cluster;
    };

    this.getCluster = function (cluster_id_val) {
        var index = this.clusterIndexArray().indexOf(cluster_id_val);
        if (index === -1) {
            return null;
        } else {
            var cluster =this.clusterTableArray()[index];
            return cluster;
        }
    };

    this.receiveData = function (cluster_id_val, data_val) {
        var cluster = this.getCluster(cluster_id_val);
        if (!cluster) {
            return;
        }
        cluster.receiveData(data_val);
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


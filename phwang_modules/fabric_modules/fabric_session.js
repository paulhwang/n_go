/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_module.js
 */

module.exports = {
    malloc: function (link_object_val, session_id_val) {
        return new FabricSessionClass(link_object_val, session_id_val);
    },
};

function FabricSessionClass(link_object_val, session_id_val) {
    "use strict";

    this.init__ = function (link_object_val, session_id_val) {
        this.theLinkObject = link_object_val;
        this.theSessionId = session_id_val;
        this.theHisSession = null;
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.rootObject().importObject().mallocQueue();
        this.theTransmitQueue = this.rootObject().importObject().mallocQueue();
        this.debug(true, "init__", "session=" + this.sessionName());
    };

    this.objectName = function () {
        return "FabricSessionClass";
    };

    this.linkObject = function () {
        return this.theLinkObject;
    };

    this.sessionId = function () {
        return this.theSessionId;
    };

    this.rootObject = function () {
        return this.linkObject().rootObject();
    };

    this.utilObject = function () {
        return this.linkObject().utilObject();
    };

    this.clusterObject = function () {
        return this.theClusterObject;
    };

    this.setClusterObject = function (val) {
        this.theClusterObject = val;
    };

    this.setSessionId = function (val) {
        this.theSessionId = val;
    };

    this.sessionName = function () {
        return  this.linkObject().linkId() + ":" + this.sessionId();
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.receiveRing = function () {
        return this.theReceiveRing;
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

    this.enqueueReceiveData = function (data_val) {
        this.debug(true, "enqueueReceiveData", data_val);
        this.receiveQueue().enQueue(data_val);
        this.receiveRing().enQueue(data_val);
    };

    this.dequeueReceiveData = function () {
        var data = this.receiveQueue().deQueue();
        this.debug(true, "dequeueReceiveData", data);

        var data1 = this.receiveRing().deQueue();
        if (data !== data1) {
            this.abend("dequeueReceiveData", "queue and ring not match");
        }

        return data;
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

    this.init__(link_object_val, session_id_val);
}

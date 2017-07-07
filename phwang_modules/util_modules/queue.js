/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new QueueClass(root_object_val);
    },
};

function QueueClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theListObject = require("./list_mgr.js").malloc_mgr(this, 0);
        this.debug(true, "init__", this.rootObject().objectName());
        if (this.debugRing()) {
            this.theRingObject = this.rootObject().importObject().mallocRing();
        }
    };

    this.debugRing = function () {
        return false;
    };

    this.objectName = function () {
        return "QueueClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ringObject = function () {
        return this.theRingObject;
    }

    this.listObject = function () {
        return this.theListObject;
    };

    this.size = function () {
        return this.listObject().size();
    }

    this.enQueue = function (data_val) {
        if (!data_val) {
            this.abend("enQueue", "null data_val");
            return;
        }

        if (this.debugRing()) {
            var i = 10
            while (i > 0) {
                this.ringObject().enQueue(data_val);
                i -= 1;
            }
        }

        var entry = new HolderEntryClass(this, this.listObject().allocId());
        entry.setData(data_val);
        this.listObject().enQueue(entry);
    };

    this.deQueue = function () {
        var entry = this.listObject().deQueue();
        if (!entry) {
            this.debug(false, "deQueue", "empty: " + this.rootObject().objectName());
            return null;
        }
        var data = entry.data();

        if (data && this.debugRing()) {
            var i = 10
            while (i > 0) {
                var data1 = this.ringObject().deQueue();
                if (!data1) {
                    this.abend("deQueue", "null");
                }
                if (data != data1) {
                    this.abend("deQueue", "ring not match");
                }
                i -= 1;
            }
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

    this.init__(root_object_val);
}

function HolderEntryClass(queue_object_val, holder_id_val) {
    "use strict";

    this.init__ = function (queue_object_val, holder_id_val) {
        this.theQueueObject = queue_object_val;
        this.theJointObject = require("./list_mgr.js").malloc_joint(holder_id_val);
        this.theData = null;
        this.thePrev = null;
        this.theNext = null;
        this.debug(false, "init__", "holderId=" + this.queueObject().rootObject().objectName() + ":" + this.holderId());
    };

    this.objectName = function () {
        return "HolderEntryClass";
    };

    this.queueObject = function () {
        return this.theQueueObject;
    };

    this.rootObject = function () {
        return this.queueObject().rootObject();
    };

    this.jointObject = function () {
        return this.theJointObject;
    };

    this.data = function () {
        return this.theData;
    };

    this.setData = function (val) {
        this.theData = val;
    };

    this.holderId = function () {
        return this.jointObject().entryId();
    };

    this.prev = function () {
        return this.thePrev;
    };

    this.setPrev = function (val) {
        this.thePrev = val;
    };

    this.next = function () {
        return this.theNext;
    };

    this.setNext = function (val) {
        this.theNext = val;
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

    this.init__(queue_object_val, holder_id_val);
}

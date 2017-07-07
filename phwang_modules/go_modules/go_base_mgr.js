/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_dlink.js
 */

var the_go_base_mgr_object = null;

module.exports = {
    malloc: function (root_object_val) {
        if (!the_go_base_mgr_object) {
            the_go_base_mgr_object = new GoBaseMgrClass(root_object_val);
        }
        return the_go_base_mgr_object;
    },

    malloc_base: function () {
        return the_go_base_mgr_object.mallocBase();
    },

    receive_data: function (base_id_val, data_val) {
        the_go_base_mgr_object.receiveData(base_id_val, data_val);
    },

    transmit_data: function (base_id_val) {
        return the_go_base_mgr_object.transmitData(base_id_val);
    },
};

function GoBaseMgrClass(root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theGlobalBaseId = 0;
        this.theBaseIndexArray = [0];
        this.theBaseTableArray = [null];
        this.debug(true, "init__", "");
    };

    this.objectName = function () {
        return "GoBaseMgrClass";
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

    this.baseIndexArray = function () {
        return this.theBaseIndexArray;
    };

    this.baseTableArray = function () {
        return this.theBaseTableArray;
    };

    this.baseTableArrayLength = function () {
        return this.baseTableArray().length;
    };

    this.baseTableArrayElement = function (val) {
        return this.baseTableArray()[val];
    };

    this.globalBaseId = function () {
        return this.theGlobalBaseId;
    };

    this.incrementGlobalBaseId = function () {
        this.theGlobalBaseId += 1;
    };

    this.allocBaseId = function () {
        this.incrementGlobalBaseId();
        return this.globalBaseId();
    }

    this.mallocBase = function () {
        var base = this.importObject().importBase().malloc(this.rootObject(), this.allocBaseId());
        this.baseIndexArray().push(base.baseId());
        this.baseTableArray().push(base);
        return base.baseId();
    };

    this.getBase = function (base_id_val) {
        var index = this.baseIndexArray().indexOf(base_id_val);
        if (index === -1) {
            return null;
        } else {
            var base =this.baseTableArray()[index];
            return base;
        }
    };

    this.receiveData = function (base_id_val, data_val) {
        this.debug(false, "receiveData", "data=" + data_val);
        var base = this.getBase(base_id_val);
        if (!base) {
            return;
        }
        base.portObject().receiveStringData(data_val);
    };

    this.transmitData = function (base_id_val) {
        var base = this.getBase(base_id_val);
        if (!base) {
            return null;
        }
        return base.portObject().dequeueTransmitData();
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


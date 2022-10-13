/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: u_fabric.js
 */

let THE_U_FABRIC_OJBECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_U_FABRIC_OJBECT) {
            THE_U_FABRIC_OJBECT = new UFabricClass(root_obj_val);
        }
        return THE_U_FABRIC_OJBECT;
    },
};

function UFabricClass (root_obj_val) {
    "use strict";

    this.init__ = function (root_obj_val) {
        this.rootObj_ = root_obj_val;

        this.globalAjaxId_ = 0;
        this.maxAjaxIdIndex_ = 0;
        this.ajaxIdArray_ = [];
        this.setMaxGlobalAjaxId(this.FABRIC_DEF().AJAX_ID_SIZE());
    };

    this.mallocAjaxEntry = function (res_val) {
        this.incrementGlobalAjaxId();
        var ajax_id_str = this.encodeObj().encodeNumber(this.globalAjaxId(), this.FABRIC_DEF().AJAX_ID_SIZE());
        var ajax_entry_object = new AjaxEntryClass(ajax_id_str, res_val);
        return ajax_entry_object;
    };

    this.getAjaxEntry = function (ajax_id_val) {
        let found = false;
        let index = 0;
        for (; index < this.maxAjaxIdIndex(); index++) {
            if (this.ajaxIdArrayElement(index)) {
                if (this.ajaxIdArrayElement(index).ajaxId() === ajax_id_val) {
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            console.log("UFabricClass.getAjaxEntry() not_found! ajax_id_val=" + ajax_id_val);
            abend();
            return;
        }

        const element = this.ajaxIdArrayElement(index);
        this.clearAjaxIdArrayElement(index)
        return element;
    };

    this.putAjaxEntry = function (val) {
        for (let i = 0; i < this.maxAjaxIdIndex(); i++) {
            if (!this.ajaxIdArrayElement(i)) {
                this.setAjaxIdArrayElement(i, val);
                return;
            }
        }
        this.setAjaxIdArrayElement(this.maxAjaxIdIndex(), val);
        this.incrementMaxAjaxIdIndex();
    };

    this.incrementGlobalAjaxId = function () {
        this.globalAjaxId_++;
        if (this.globalAjaxId_ > this.maxGolbalAjaxId()) {
            this.globalAjaxId_ = 1;
        }
    };

    this.setMaxGlobalAjaxId = function (ajax_id_size_val) {
        this.maxGolbalAjaxId_ = 1;
        for (let i = 0; i < ajax_id_size_val; i++) {
            this.maxGolbalAjaxId_ *= 10;
        }
        this.maxGolbalAjaxId_ -= 1;
    };

    this.maxAjaxIdIndex = () => this.maxAjaxIdIndex_;
    this.incrementMaxAjaxIdIndex = () => {this.maxAjaxIdIndex_++;}
    this.globalAjaxId = () => this.globalAjaxId_;
    this.maxGolbalAjaxId = () => this.maxGolbalAjaxId_;
    this.ajaxIdArrayElement = (index) => this.ajaxIdArray_[index];
    this.setAjaxIdArrayElement = (index, val) => {this.ajaxIdArray_[index] = val;}
    this.clearAjaxIdArrayElement = (index) => {this.ajaxIdArray_[index] = 0;}
    this.rootObj = () => this.rootObj_;
    this.FABRIC_DEF = () => this.rootObj().FABRIC_DEF();
    this.dFabricObj = () => this.rootObj().dFabricObj();
    this.dPortObj = () => this.rootObj().dPortObj();
    this.uPortObj = () => this.rootObj().uPortObj();
    this.encodeObj = () => this.rootObj().encodeObj();

    this.init__(root_obj_val);
}

function AjaxEntryClass (ajax_id_val, res_val) {
    "use strict";

    this.init__ = function (ajax_id_val, res_val) {
        this.ajaxId_ = ajax_id_val;
        this.ajaxResponse_ = res_val;
    }

    this.ajaxId = () => this.ajaxId_;
    this.ajaxResponse = () => this.ajaxResponse_;
    this.init__(ajax_id_val, res_val);
}

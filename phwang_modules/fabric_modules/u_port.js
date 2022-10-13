/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: u_port.js
 */

let THE_U_PORT_OJBECT = null;

module.exports = {
    malloc: function (root_obj_val) {
        if (!THE_U_PORT_OJBECT) {
            THE_U_PORT_OJBECT = new UPortClass(root_obj_val);
        }
        return THE_U_PORT_OJBECT;
    },
};

function UPortClass (root_obj_val) {
    "use strict";

    this.init__ = function (root_obj_val) {
        this.rootObj_ = root_obj_val;
    };

    this.rootObj = () => this.rootObj_;
    this.FABRIC_DEF = () => this.rootObj().FABRIC_DEF();
    this.netSocketOjbect = () => this.netSocketObject_;
    this.dFabricObj = () => this.rootObj().dFabricObj();
    this.dPortObj = () => this.rootObj().dPortObj();

    this.init__(root_obj_val);
}

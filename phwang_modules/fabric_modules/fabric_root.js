/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_root.js
 */

let THE_FABRIC_ROOT_OBJECT = null;

module.exports = {
    malloc: function () {
        if (!THE_FABRIC_ROOT_OBJECT) {
            THE_FABRIC_ROOT_OBJECT = new FabricRootClass();
        }
        return THE_FABRIC_ROOT_OBJECT;
    },
};

function FabricRootClass () {
    "use strict";

    this.init__ = function () {
        this.FABRIC_DEF_ = require("./fabric_def.js").malloc();
        this.encodeObject_ = require("../util_modules/encode.js").malloc();
        this.uFabricObj_ = require("./u_fabric.js").malloc(this);
        this.dPortObj_ = require("./d_port.js").malloc(this);
        this.dFabricObj_ = require("./d_fabric.js").malloc(this);
        console.log("FrontEndRootClass.init__()");
    };

    this.FABRIC_DEF = () => this.FABRIC_DEF_;
    this.encodeObject = () => this.encodeObject_;
    this.uFabricObj = () => this.uFabricObj_;
    this.httpInputObject = () => this.dPortObj_;
    this.dFabricObj = () => this.dFabricObj_;

    this.init__();
};

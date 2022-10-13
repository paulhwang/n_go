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
        this.encodeObj_ = require("../util_modules/encode.js").malloc();
        this.uPortObj_ = require("./u_port.js").malloc(this);
        this.uNodeObj_ = require("./u_node.js").malloc(this);
        this.dPortObj_ = require("./d_port.js").malloc(this);
        this.dNodeObj_ = require("./d_node.js").malloc(this);
    };

    this.FABRIC_DEF = () => this.FABRIC_DEF_;
    this.encodeObj = () => this.encodeObj_;
    this.uPortObj = () => this.uPortObj_;
    this.uNodeObj = () => this.uNodeObj_;
    this.dPortObj = () => this.dPortObj_;
    this.dNodeObj = () => this.dNodeObj_;

    this.init__();
};

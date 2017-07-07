/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new GoImportClass(root_object_val);
    },
};

function GoImportClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
    };

    this.objectName = function () {
        return "GoImportClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importBase = function () {
        return require("./go_base.js");
    };

    this.importUlink = function () {
        return require("./go_ulink.js");
    }

    this.importBaseMgr = function () {
        return require("./go_base_mgr.js");
    }

    this.importConfig = function () {
        return require("./go_config.js");
    };

    this.importMove = function () {
        return require("./go_move.js");
    }

    this.importBoard = function () {
        return require("./go_board.js");
    }

    this.importGame = function () {
        return require("./go_game.js");
    }

    this.importPort = function () {
        return require("./go_port.js");
    }

    this.importEngine = function () {
        return require("./go_engine.js");
    }

    this.importGroup = function () {
        return require("./go_group.js");
    }

    this.importGroupList = function () {
        return require("./go_group_list.js");
    }

    this.importListMgr = function () {
        return require("../util_modules/list_mgr.js");
    };

    this.importLogit = function () {
        return require("../util_modules/logit.js");
    }

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this.rootObject());
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this.rootObject());
    };

    this.init__(root_object_val);
};

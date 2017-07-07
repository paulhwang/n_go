/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: fabric_import.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new FabricImportClass(root_object_val);
    },
};

function FabricImportClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
    };

    this.objectName = function () {
        return "FabricImportClass";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.importClusterMgr = function () {
        return require("./fabric_cluster_mgr.js");
    }

    this.importCluster = function () {
        return require("./fabric_cluster.js");
    }

    this.importLinkMgr = function () {
        return require("./fabric_link_mgr.js");
    }

    this.importLinkMgrService = function () {
        return require("./link_mgr_service.js");
    }

    this.importAjaxParser = function () {
        return require("./fabric_ajax_parser.js");
    };

    this.importAjax = function () {
        return require("./fabric_ajax.js");
    };

    this.importLink = function () {
        return require("./fabric_link.js");
    }

    this.importSession = function () {
        return require("./fabric_session.js");
    }

    this.importListMgr = function () {
        return require("../util_modules/list_mgr.js");
    };

    this.importLogit = function () {
        return require("../util_modules/logit.js");
    }

    this.importNetClient = function () {
        return require("../util_modules/net_client.js");
    }

    this.mallocQueue = function () {
        return require("../util_modules/queue.js").malloc(this.rootObject());
    };

    this.mallocRing = function () {
        return require("../util_modules/ring.js").malloc(this.rootObject());
    };

    this.init__(root_object_val);
};

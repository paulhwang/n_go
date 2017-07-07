/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: list_mgr.js
 */

module.exports = {
    malloc_mgr: function (host_object_val, global_id_val) {
        return new ListMgrClass(host_object_val, global_id_val);
    },

    malloc_joint: function (entry_id_val, entry_name_val) {
        return new ListjointClass(entry_id_val, entry_name_val);
    },
};

function ListMgrClass(host_object_val, global_id_val) {
    "use strict";

    this.init__ = function (host_object_val, global_id_val) {
        this.theHostObject = host_object_val;
        this.theGlobalId = global_id_val;
        this.theHead = null;
        this.theTail = null;
        this.theSize = 0;
        this.debug(true, "init__", this.hostObject().objectName());
    };

    this.objectName = function () {
        return "ListMgrClass";
    };

    this.hostObject = function () {
        return this.theHostObject;
    };

    this.head = function () {
        return this.theHead;
    }

    this.setHead = function (val) {
        this.theHead = val;
    }

    this.tail = function () {
        return this.theTail;
    }

    this.setTail = function (val) {
        this.theTail = val;
    }

    this.size = function () {
        return this.theSize;
    }

    this.incrementSize = function () {
        this.theSize += 1;
    }

    this.decrementSize = function () {
        this.theSize -= 1;
    }

    this.globalId = function () {
        return this.theGlobalId;
    };

    this.incrementGlobalId = function () {
        this.theGlobalId += 1;
    };

    this.allocId = function () {
        this.incrementGlobalId();
        return this.globalId();
    }

    this.enQueue = function (entry_val) {
        if (!entry_val) {
            this.abend("enQueue", "null entry_val");
            return;
        }

        this.abendIt();

        this.incrementSize();
        if (!this.head()) {
            entry_val.jointObject().setPrev_(null);
            entry_val.jointObject().setNext_(null);
            this.setHead(entry_val);
            this.setTail(entry_val);
        } else {
            this.tail().jointObject().setNext_(entry_val);
            entry_val.jointObject().setPrev_(this.tail());
            entry_val.jointObject().setNext_(null);
            this.setTail(entry_val);
        }
        this.abendIt();
    };

    this.deQueue = function () {
        this.abendIt();
        var entry = this.head();

        if (this.head()) {
            if (this.head() === this.tail()) {
                this.decrementSize();
                this.setHead(null);
                this.setTail(null);
            } else {
                this.decrementSize();
                this.setHead(this.head().jointObject().next());
                this.head().jointObject().setPrev(null);
            }
        }

        this.abendIt();
        return entry;
    };


    this.unQueue = function (entry_val) {
        if (this.size() <= 0) {
            this.abend("unQueue", "size=" + this.size());
            return;
        }
 
        if (!this.searchEntry(entry_val)) {
            this.abend("unQueue", "entry does not exist in the list");
            return;
        }

        this.abendIt();
        if (entry_val.jointObject().prev_()) {
            entry_val.jointObject().prev_().jointObject().setNext_(entry_val.jointObject().next_());
        } else {
            this.setHead(entry_val.jointObject().next_());
        }

        if (entry_val.jointObject().next_()) {
            entry_val.jointObject().next_().jointObject().setPrev_(entry_val.jointObject().prev_());
        } else {
            this.setTail(entry_val.jointObject().prev_());
        }

        this.decrementSize();
        this.abendIt();
    };
    
    this.searchEntry = function (entry_val) {
        this.debug(true, "searchEntry", "id=" + entry_val.jointObject().entryId() + " name=" + entry_val.jointObject().entryName());
        var entry = this.head();
        while (entry) {
            if (entry === entry_val) {
                return entry;
            }
            entry = entry.jointObject().next_();
        }
        return null;
    };
    
    this.searchId = function (id_val) {
        this.debug(false, "searchId", "id=" + id_val);
        var entry = this.head();
        while (entry) {
            if (entry.jointObject().entryId() === id_val) {
                return entry;
            }
            entry = entry.jointObject().next_();
        }
        return null;
    };

    this.searchName = function (name_val) {
        this.debug(false, "searchName", "name=" + name_val);
        var entry = this.head();
        while (entry) {
            this.debug(false, "searchName", "entryName=" + entry.jointObject().entryName());
            if (entry.jointObject().entryName() === name_val) {
                return entry;
            }
            entry = entry.jointObject().next_();
        }
        return null;
    };

    this.searchIdName = function (id_val, name_val) {
        this.debug(false, "searchIdName", "id=" + id_val + " name=" + name_val);
        var entry = this.head();
        while (entry) {
            this.debug(false, "searchIdName", "entryId=" + entry.jointObject().entryId() + " entryName=" + entry.jointObject().entryName());
            if ((entry.jointObject().entryId() === id_val) && (entry.jointObject().entryName() === name_val)) {
                return entry;
            }
            entry = entry.jointObject().next_();
        }
        return null;
    };

    this.abendIt = function () {
        var i = 0;
        var link = this.head();
        while (link) {
            link = link.jointObject().next_();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        link = this.tail();
        while (link) {
            link = link.jointObject().prev_();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "tail: size=" + this.size() + " i=" + i);
        }
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, str2_val);
        }
    };

    this.logit = function (str1_val, str2_val) {
        this.LOG_IT(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        this.ABEND(this.objectName() + "." + str1_val, str2_val);
    };

    this.LOG_IT = function(str1_val, str2_val) {
        require("../util_modules/logit.js").LOG_IT(str1_val, str2_val);
    };

    this.ABEND = function(str1_val, str2_val) {
        require("../util_modules/logit.js").ABEND(str1_val, str2_val);
    };

    this.init__(host_object_val, global_id_val);
}

function ListjointClass(entry_id_val, entry_name_val) {
    "use strict";

    this.init__ = function (entry_id_val, entry_name_val) {
        this.theEntryId = entry_id_val;
        if (entry_name_val) {
            this.theEntryName = entry_name_val;
        } else {
            this.theEntryName = null;
        }
        this.thePrev_ = null;
        this.theNext_ = null;
    };

    this.entryId = function () {
        return this.theEntryId;
    };

    this.entryName = function () {
        return this.theEntryName;
    };

    this.prev_ = function () {
        return this.thePrev_;
    };

    this.setPrev_ = function (val) {
        this.thePrev_ = val;
    };

    this.next_ = function () {
        return this.theNext_;
    };

    this.setNext_ = function (val) {
        this.theNext_ = val;
    };

    this.init__(entry_id_val, entry_name_val);
};

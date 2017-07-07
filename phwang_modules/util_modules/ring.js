/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: ring_module.js
 */

module.exports = {
    malloc: function (root_object_val) {
        return new RingClass(root_object_val);
    },
};

function RingClass (root_object_val) {
    "use strict";

    this.init__ = function (root_object_val) {
        this.theRootObject = root_object_val;
        this.theInput = 0;
        this.theOutput = 0;
        this.theSize = 2;
        this.theLeft = this.size();
        this.theArray = [this.size()];
        this.debug(false, "init__", "");
    };

    this.objectName = function () {
        return "RingClass";
    };

    this.holderPoolModule = function () {
        return require("./holder_pool_module.js");
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.input = function () {
        return this.theInput;
    }

    this.setInput = function (val) {
        this.theInput = val;
    }

    this.incrementInput = function () {
        this.theInput += 1;
    }

    this.output = function () {
        return this.theOutput;
    }

    this.setOutput = function (val) {
        this.theOutput = val;
    }

    this.incrementOutput = function () {
        this.theOutput += 1;
    }

    this.size = function () {
        return this.theSize;
    }

    this.setSize = function (val) {
        this.theSize = val;
    }

    this.incrementSize = function () {
        this.theSize += 1;
    }

    this.decrementSize = function () {
        this.theSize -= 1;
    }

    this.left = function () {
        return this.theLeft;
    }

    this.setLeft = function (val) {
        this.theLeft = val;
    }

    this.incrementLeft = function () {
        this.theLeft += 1;
    }

    this.decrementLeft = function () {
        this.theLeft -= 1;
    }

    this.array = function (index_val) {
        return this.theArray[index_val];
    }

    this.setArray = function (index_val, data_val) {
        this.theArray[index_val] = data_val;
    }

    this.enQueue = function (data_val) {
        if (this.left() < 0) {
            this.abend("enQueue", "left=" + this.left());
            return;
        }

        if (this.left() <= (this.size() / 2)) {
            this.enlargeSize();
        }

        this.setArray(this.input(), data_val);
        this.incrementInput();
        if (this.input() === this.size()) {
            this.setInput(0);
        }
        this.decrementLeft();

        this.abendIt();
    };

    this.deQueue = function () {
        if (this.left() === this.size()) {
            return null;
        }

        var data = this.array(this.output());
        this.incrementOutput();
        if (this.output() === this.size()) {
            this.setOutput(0);
        }
        this.incrementLeft();

        this.abendIt();

        return data;
    };

    this.removeElement = function (func_val, input_val1, input_val2, input_val3) {
    };

    this.searchIt = function (func_val, input_val1, input_val2, input_val3) {
    };

    this.enlargeSize = function () {
        this.debug(false, "enlargeSize", "size=" + this.size() + "=>" + this.size() * 2);

        var i = this.size();
        while (i < this.size() * 2) {
            this.setArray(i, null);
            i += 1;
        }

        if (this.input() < this.output()) {
            i = 0;
            while (i <= this.input()) {
                this.setArray(this.size() + i, i);
                i += 1;
            }
            this.input += this.size();
        }

        this.setLeft(this.left() + this.size());
        this.setSize(this.size() * 2);

        this.abendIt();
    };

    this.abendIt = function () {
        if (this.left() < 0) {
            this.abend("abendIt", "left=" + this.left());
        }

        if ((this.input() + this.left() - this.output() !== this.size()) && (this.input() + this.left() - this.output() !== 0)) {
            this.abend('abendIt', "input(" + this.input() + ") + left(" + this.left() + ") - output(" + this.output() + ") !== size(" + this.size() + ")");
        }
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

/*jslint node: true*/
function Route(app) {
    var that = this;

    this.app = app;

    if (!this.app) {
        throw new Error("No app defined for route");
    }

    if (typeof this.initialize === 'function') {
        this.initialize();
    }
}

exports.createRoute = function (proto) {
    function R() {
        var args = Array.prototype.slice.call(arguments);
        Route.apply(this, args);
    }
    R.prototype = proto;
    R.constructor = R;
    return R;
}

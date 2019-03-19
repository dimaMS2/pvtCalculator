class Properties {
    constructor() {
        // selected param
        this._selectedParam = "Pb";

        // reservoir
        this._p = 1469.594877764675;
        this._t = 212;

        // oil
        this._yAPI = 45.375;
        this._rsb = 561.4583333333342;

        // gas
        this._yg = 0.8;
        this._pc = 600;
        this._tc = 300;
    }


    get p() {
        return this._p;
    }

    set p(value) {
        this._p = value;
    }

    get t() {
        return this._t;
    }

    set t(value) {
        this._t = value;
    }

    get yAPI() {
        return this._yAPI;
    }

    set yAPI(value) {
        this._yAPI = value;
    }

    get rsb() {
        return this._rsb;
    }

    set rsb(value) {
        this._rsb = value;
    }

    get yg() {
        return this._yg;
    }

    set yg(value) {
        this._yg = value;
    }

    get pc() {
        return this._pc;
    }

    set pc(value) {
        this._pc = value;
    }

    get tc() {
        return this._tc;
    }

    set tc(value) {
        this._tc = value;
    }


    get selectedParam() {
        return this._selectedParam;
    }

    set selectedParam(value) {
        this._selectedParam = value;
    }
}
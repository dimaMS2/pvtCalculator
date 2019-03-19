class Gas {
}

Gas.PseudoReduced = class {

    static tPr(t, tc) {
        return t / tc;
    }

    static pPr(p, pc) {
        return p / pc;
    }
};

Gas.ZFactor = class {
    static e() {
        return 0.000000000001;
    }

    static dranchuk(t, tc, p, pc) {
        var i = 0;
        var x1;
        var x0 = 0.5;

        do {
            x1 = x0 - this.f(x0, t, tc, p, pc) / this.dfdz(x0, t, tc, p, pc);
            if (Math.abs(x1 - x0) < this.e()) {
                break;
            }
            x0 = Math.abs(x1) + this.e() / 10;
            i++;
        } while (i < 100);
        return (x1 + x0) / 2;
    }

    static A() {
        return [0.3265, -1.07, -0.5339, 0.01569, -0.05165, 0.5475, -0.7361, 0.1844,
            0.1056, 0.6134, 0.721]
    };

    static rho(z, t, tc, p, pc) {
        return 0.27 * Gas.PseudoReduced.pPr(p, pc) / (z * Gas.PseudoReduced.tPr(t, tc));
    }

    static c1(t, tc) {
        const A = this.A();
        return A[0] + A[1] / Gas.PseudoReduced.tPr(t, tc) + A[2] / Math.pow(Gas.PseudoReduced.tPr(t, tc), 3.0) + A[3] /
            Math.pow(Gas.PseudoReduced.tPr(t, tc), 4.0) + A[4] / Math.pow(Gas.PseudoReduced.tPr(t, tc), 5.0);
    }

    static c2(t, tc) {
        const A = this.A();
        return A[5] + A[6] / Gas.PseudoReduced.tPr(t, tc) + A[7] / Math.pow(Gas.PseudoReduced.tPr(t, tc), 2);
    }

    static c3(t, tc) {
        const A = this.A();
        return A[8] * (A[6] / Gas.PseudoReduced.tPr(t, tc) + A[7] / Math.pow(Gas.PseudoReduced.tPr(t, tc), 2));
    }

    static c4(z, t, tc, p, pc) {
        const A = this.A();
        return A[9] * (1 + A[10] * Math.pow(this.rho(z, t, tc, p, pc), 2)) * Math.pow(this.rho(z, t, tc, p, pc), 2) /
            Math.pow(Gas.PseudoReduced.tPr(t, tc), 3) * Math.exp(-A[10] * Math.pow(this.rho(z, t, tc, p, pc), 2));
    }

    static f(z, t, tc, p, pc) {
        return z - (1 + this.c1(t, tc) * this.rho(z, t, tc, p, pc) + this.c2(t, tc) * Math.pow(this.rho(z, t, tc, p, pc), 2) -
            this.c3(t, tc) * Math.pow(this.rho(z, t, tc, p, pc), 5) + this.c4(z, t, tc, p, pc));
    }

    static dfdz(z, t, tc, p, pc) {
        const A = this.A();
        return 1 + this.c1(t, tc) * this.rho(z, t, tc, p, pc) / z + 2 * this.c2(t, tc) * Math.pow(this.rho(z, t, tc, p, pc), 2) / z -
            5 * this.c3(t, tc) * Math.pow(this.rho(z, t, tc, p, pc), 5) / z + 2 * A[9] *
            Math.pow(this.rho(z, t, tc, p, pc), 2) / (Math.pow(Gas.PseudoReduced.tPr(t, tc), 3) * z) *
            (1 + A[10] * Math.pow(this.rho(z, t, tc, p, pc), 2) - Math.pow(A[10] *
                Math.pow(this.rho(z, t, tc, p, pc), 2), 2)) * Math.exp(-A[10] * Math.pow(this.rho(z, t, tc, p, pc), 2));
    }

};

Gas.VolumeFactor = class {
    static internal(z, t, p) {
        return 0.02826136 * z * t / p;
    }
};


Gas.PseudoCriticalTemperature = class {
    static suttonTc(yg) {
        return 169.2 + 349.4 * yg - 74 * yg * yg;
    }
};

Gas.PseudoCriticalPressure = class {
    static suttonPc(yg) {
        return 756.8 - 131 * yg - 3.6 * yg * yg;
    }

};


Gas.Compressibility = class {
    static dranchuk(z, t, tc, p, pc) {
        return this.cPr(z, t, tc, p, pc) / pc;
    }

    static cPr(z, t, tc, p, pc) {
        return (1 - this.x(z, t, tc, p, pc) / (1 + this.x(z, t, tc, p, pc))) / Gas.PseudoReduced.pPr(p, pc);
    }

    static x(z, t, tc, p, pc) {
        return Gas.ZFactor.rho(z, t, tc, p, pc) / z * this.dfdrho(z, t, tc, p, pc);
    }

    static dfdrho(z, t, tc, p, pc) {
        let A = Gas.ZFactor.A();
        return Gas.ZFactor.c1(t, tc) + 2 * Gas.ZFactor.c2(t, tc) * Gas.ZFactor.rho(z, t, tc, p, pc) - 5 * Gas.ZFactor.c3(t, tc) *
            Math.pow(Gas.ZFactor.rho(z, t, tc, p, pc), 4) + 2 * A[9] * (1 + A[10] *
                Math.pow(Gas.ZFactor.rho(z, t, tc, p, pc), 2) - A[10] * A[10] *
                Math.pow(Gas.ZFactor.rho(z, t, tc, p, pc), 4)) * Gas.ZFactor.rho(z, t, tc, p, pc) *
            Math.exp(-A[10] * Math.pow(Gas.ZFactor.rho(z, t, tc, p, pc), 2)) /
            Math.pow(Gas.PseudoReduced.tPr(t, tc), 3);
    }
};

Gas.Viscosity = class {
    static a() {
        return 0.46487
    };

    static M_AIR() {
        return 28.967
    };

    static leeEtAl(z, t, p, yg) {
        return this.k(t, yg) * Math.exp(this.x(t, yg) * Math.pow(this.rho(z, t, p, yg), this.y(t, yg))) / 10000;
    }

    static mg(yg) {
        return yg * this.M_AIR();
    }

    static rho(z, t, p, yg) {
        return p * yg * this.a() / (z * t * 10.732);
    }

    static k(t, yg) {
        return (9.4 + 0.02 * this.mg(yg)) * Math.pow(t, 1.5) / (209 + 19 * this.mg(yg) + t);
    }

    static x(t, yg) {
        return 3.5 + 986 / t + 0.01023 * this.mg(yg);
    }

    static y(t, yg) {
        return 2.4 - 0.2 * this.x(t, yg);
    }
};

Gas.Density = class {
    static k() {
        return 0.0433571;
    }
    static internal(yg, z, t, p) {
        return this.gCCtoLbFt3(p * yg * this.k() / (z * t));
    }

    static gCCtoLbFt3(gCC) {
        return gCC * 62.4;
    }
};

class Oil {
}

Oil.Glaso = class {
    static bob(t, yAPI, yg, rs) {
        return rs * Math.pow(yg / Converter.yAPItoYo(yAPI), 0.526) + 0.968 * t;
    }
};

Oil.Standing = class {
    static x(t, yAPI) {
        return 0.00091 * t - 0.0125 * yAPI;
    }

    static rsFormula(t, p, yAPI, yg) {
        return yg * Math.pow((p / 18.2 + 1.4) * Math.pow(10, -this.x(t, yAPI)), (1 / 0.83));
    }
};

Oil.Beal = class {
    static x(yAPI) {
        return Math.pow(10, 0.43 + 8.33 / yAPI);
    }
};

Oil.Dead = class {
};
Oil.Dead.Viscosity = class {
    static beal(t, yAPI) {
        return (0.32 + 18000000 / Math.pow(yAPI, 4.53)) * Math.pow(360 / (t + 200), Oil.Beal.x(yAPI));
    }
};

Oil.UnderSaturated = class {
};
Oil.UnderSaturated.Compressibility = class {
    static vasquezBeggs(t, p, yAPI, yg, rsb) {
        var c;
        c = (-1433 + 5 * rsb + 17.2 * t - 1180 * yg + 12.61 * yAPI) / (100000 * p);
        if (c < 6.89476E-27) {
            c = 6.89476E-27;
        }
        return c;
    }
};

Oil.UnderSaturated.VolumeFactor = class {
    static glaso(t, yAPI, yg, rsb, coefC) {
        return coefC * Oil.Saturated.VolumeFactor.glaso(t, yAPI, yg, rsb);
    }
};

Oil.UnderSaturated.Viscosity = class {
    static beal(t, p, pb, yAPI, rsb) {
        return Oil.Saturated.Viscosity.chewConnalyConstructor(rsb, Oil.Dead.Viscosity.beal(t, yAPI)) + 0.001 *
            (p - pb) * (0.024 * Math.pow(Oil.Saturated.Viscosity.chewConnalyConstructor(rsb,
                Oil.Dead.Viscosity.beal(t, yAPI)), 1.6) + 0.038 *
                Math.pow(Oil.Saturated.Viscosity.chewConnalyConstructor(rsb, Oil.Dead.Viscosity.beal(t, yAPI)), 0.56));
    }
};

Oil.UnderSaturated.CoefC = class {
    static vasquezBeggs(t, p, pb, yAPI, yg, rsb) {
        var coefC;
        coefC = Math.exp(-Oil.UnderSaturated.Compressibility.vasquezBeggs(t, p, yAPI, yg, rsb) * p *
            Math.log(p / pb));
        return coefC;
    }
};

Oil.Saturated = class {
};
Oil.Saturated.GasOilRatio = class {
    static standing(t, p, yAPI, yg) {
        return Oil.Standing.rsFormula(t, p, yAPI, yg);
    }
};

Oil.Saturated.VolumeFactor = class {
    static glaso(t, yAPI, yg, rs) {
        return 1 + Math.pow(10, -6.58511 + 2.91329 * Math.log10(Oil.Glaso.bob(t, yAPI, yg, rs)) - 0.27683 *
            Math.pow(Math.log10(Oil.Glaso.bob(t, yAPI, yg, rs)), 2));
    }
};

Oil.Saturated.Viscosity = class {
    static chewConnalyConstructor(rs, muOD) {
        return (0.2 + 0.8 * Math.pow(10, -0.00081 * rs)) * Math.pow(muOD, 0.43 + 0.57 *
            Math.pow(10, -0.00072 * rs));
    }

    static beal(t, yAPI, rs) {
        return this.chewConnalyConstructor(rs, Oil.Dead.Viscosity.beal(t, yAPI));
    }
};

Oil.Saturated.Compressibility = class {
    static internal(bo, dBoDP, bg, dRsDP) {
        var c;
        c = (-1 / bo) * (dBoDP - (bg / 5.6145835) * dRsDP);  //5.6145835
        if (c < 6.89476E-27) {
            c = 6.89476E-27;
        }
        return c;
    }
};

Oil.Saturated.DerivativeRsWrtP = class {
    static dx() {return 1};
    static standing(t, p, yAPI, yg) {
        return (Oil.Saturated.GasOilRatio.standing(t, p + this.dx(), yAPI, yg) - Oil.Saturated.GasOilRatio.standing(t, p - this.dx(), yAPI, yg)) /
            (2 * this.dx());
    }
};

Oil.Saturated.derivativeBwrtP = class {
    static glaso(t, yAPI, yg, rs, dRsDP) {
        return -0.0000000625054 * Math.pow(10, -0.0522134 * Math.pow(Math.log(Oil.Glaso.bob(t, yAPI, yg, rs)), 2)) *
            Math.pow(yg / Converter.yAPItoYo(yAPI), 0.526) * Math.pow(Oil.Glaso.bob(t, yAPI, yg, rs), 1.91329) *
            (Math.log(Oil.Glaso.bob(t, yAPI, yg, rs)) - 12.1159) * dRsDP;
    }
};

Oil.Live = class {
};
Oil.Live.BubblePoint = class {
    static standing(t, yAPI, yg, rsb) {
        let pb;
        pb = 18.2 * (Math.pow(rsb / yg, 0.83) * Math.pow(10, Oil.Standing.x(t, yAPI)) - 1.4);

        if (pb < 0) {
            pb = 2;
        }
        return pb;
    }
};

Oil.Live.GasOilRatio = class {
    static standing(t, p, pb, yAPI, yg, rsb) {
        var rs;
        if (p < pb) {
            rs = Oil.Saturated.GasOilRatio.standing(t, p, yAPI, yg);
        } else {
            rs = rsb;
        }
        return rs;
    }
};

Oil.Live.Compressibility = class {
    static vasquezBeggs(t, p, pb, yAPI, yg, bo, rsb, dBoDP, bg, dRsDP) {
        var c;
        if (p < pb) {
            c = Oil.Saturated.Compressibility.internal(bo, dBoDP, bg, dRsDP);
        } else {
            c = Oil.UnderSaturated.Compressibility.vasquezBeggs(t, p, yAPI, yg, rsb);
        }
        return c;
    }
};

Oil.Live.VolumeFactor = class {
    static glaso(t, p, pb, yAPI, yg, rs, rsb, coefC) {
        var b;
        if (p < pb) {
            b = Oil.Saturated.VolumeFactor.glaso(t, yAPI, yg, rs);
        } else {
            b = Oil.UnderSaturated.VolumeFactor.glaso(t, yAPI, yg, rsb, coefC);
        }
        return b;
    }
};

Oil.Live.Viscosity = class {
    static beal(t, p, pb, yAPI, rs, rsb) {
        var mu;
        if (p < pb) {
            mu = Oil.Saturated.Viscosity.beal(t, yAPI, rs);
        } else {
            // At current case, rs = rsb i.e. gas/oil ration at bubble point pressure
            mu = Oil.UnderSaturated.Viscosity.beal(t, p, pb, yAPI, rsb);
        }
        return mu;
    }
};

Oil.Live.Density = class {
    static internal(yAPI, yg, rs, bo) {
        return (62.4 * Converter.yAPItoYo(yAPI) + 0.0136 * rs * yg) / bo;
    }
};


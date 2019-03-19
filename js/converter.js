class Converter {
    static cToF(t) {
        return t * 1.8 + 32;
    }

    static atmToPSIA(p) {
        return p * 14.6959;
    }

    static yAPItoYo(yAPI) {
        return 141.5 / (yAPI + 131.5);
    }

    static fToR(f) {
        return f + 459.67;
    }

    static rToF(r) {
        return r - 459.67;
    }

    static lbPerFt3ToGperCC(lbPerFt3) {
        return lbPerFt3 * 0.0160184634;
    }

    static weightPercentToPPM(s) {
        return s * 10000;
    }

    static fToK(f) {
        return (f + 459.67) * 5 / 9;
    }

    static psiaToAtm(psia) {
        return psia * 0.0680459639;
    }

    static fToC(f) {
        return (f - 32) / 1.8;
    }

    static rToC(r) {
        return (r - 491.67) * 5 / 9;
    }

    static scfStbToM3M3(scfStb) {
        return scfStb * 0.178107606679035;
    }

    static lbFt3toKgM3(lbFt3) {
        return lbFt3 * 16.01846337396;
    }

    static cToR(c) {
        return c * 9 / 5 + 491.67;
    }

    static yoToYAPI(yo) {
        return 141.5 / yo - 131.5;
    }

    static m3m3ToScfStb(m3m3) {
        return m3m3 / 0.178107606679035;
    }

    static gCCtoKgM3(gCC) {
        return gCC * 1000;
    }

    static gCCtoLbFt3(gCC) {
        return gCC * 62.42796057614516;
    }

    static cPsiaToCatm(cPsia) {
        return cPsia * 14.6959494;
    }
}
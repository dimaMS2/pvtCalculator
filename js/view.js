let properties = new Properties();

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    });
}

let txtFields = document.getElementsByClassName("rightDescr");
let f = document.getElementsByClassName("txtField");

for (let i = 0; i < txtFields.length; i++) {
    let elements = txtFields[i].getElementsByTagName("*");
    let ff = f[i].getElementsByTagName("*");
    let field = elements[0];
    setInputFilter(field, function (value) {
        return /^\d*\.?\d*$/.test(value);
    });

    switch (ff[0].innerText) {
        case "P":
            field.addEventListener("change", function () {
                properties.p = Converter.atmToPSIA(parseFloat(field.value));
            });
            break;
        case "T":
            field.addEventListener("change", function () {
                properties.t = Converter.cToF(parseFloat(field.value));
            });
            break;
        case "yg":
            field.addEventListener("change", function () {
                properties.yg = parseFloat(field.value);
                properties.tc = getTc();
                properties.pc = getPc();
            });
            break;
        case "yo":
            field.addEventListener("change", function () {
                properties.yAPI = Converter.yoToYAPI(parseFloat(field.value));
            });
            break;
        case "Rsb":
            field.addEventListener("change", function () {
                properties.rsb = Converter.m3m3ToScfStb(parseFloat(field.value));
            });
            break;
    }

    field.addEventListener("change", function () {
        updateCurrents();
        updateSurface(properties.selectedParam);
    });
}

function plot(x, y, z, xPoint, yPoint, zPoint, zAxisDescr) {
    let xAxisDescr = 'P, атм';
    let yAxisDescr = 'T, °C';
    var layout = {
        scene: {
            aspectmode: 'cube',
            xaxis: {title: xAxisDescr, gridcolor: 'white', zerolinecolor: 'white', spikecolor: '#1fe5bd'},
            yaxis: {title: yAxisDescr, gridcolor: 'white', zerolinecolor: 'white', spikecolor: '#1fe5bd'},
            zaxis: {title: zAxisDescr, gridcolor: 'white', zerolinecolor: 'white', spikecolor: '#1fe5bd'},
        },
        paper_bgcolor: '#404758',
        font: {
            color: 'white',
            family: 'Roboto, sans-serif'
        },
        margin: {
            t: 0, //top margin
            l: 0, //left margin
            r: 0, //right margin
            b: 0 //bottom margin
        }
    };

    let textSurface = new Array(x.length);
    let tempX = xAxisDescr.split(',');
    let tempY = yAxisDescr.split(',');
    let tempZ = zAxisDescr.split(',');
    let tempZLeft = tempZ[0];
    let tempZRight = (tempZ.length === 1) ? '' : tempZ[1];

    let textPoint = tempX[0] + ': ' + toFormat(xPoint) + ' ' + tempX[1] + '<br>' + tempY[0] + ': ' + toFormat(yPoint) + ' ' + tempY[1] + '<br>' + tempZLeft + ': ' + toFormat(zPoint) + ' ' + tempZRight

    for (let i = 0; i < x.length; i++) {
        textSurface[i] = new Array(x.length);
        for (let j = 0; j < y.length; j++) {
            textSurface[i][j] = tempX[0] + ': ' + toFormat(x[j]) + ' ' + tempX[1] + '<br>' + tempY[0] + ': ' + toFormat(y[i]) + ' ' + tempY[1] + '<br>' + tempZLeft + ': ' + toFormat(z[i][j]) + ' ' + tempZRight
        }
    }

    var data = [{
        z: z,
        x: x,
        y: y,
        type: 'surface',
        colorscale: 'YIGnBu',
        contours: {
            x: {
                highlight: true,
                highlightcolor: "#41a7b3"
            },
            y: {
                highlight: true,
                highlightcolor: "#41a7b3"
            },
            z: {
                highlight: true,
                highlightcolor: "#41a7b3"
            }
        },
        hoverinfo: 'text',
        text: textSurface,
    }, {
        z: [zPoint],
        x: [xPoint],
        y: [yPoint],
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            color: 'rgb(23, 190, 207)',
            size: 10
        },
        hoverinfo: 'text',
        text: textPoint
    }];

    var d3 = Plotly.d3;
    var WIDTH_IN_PERCENT_OF_PARENT = 100,
        HEIGHT_IN_PERCENT_OF_PARENT = 100;

    var gd3 = d3.select("div[id='plotter']")
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
        });

    var my_Div = gd3.node();

    Plotly.newPlot('plotter', data, layout, {displayModeBar: false});
    window.onresize = function() { Plotly.Plots.resize( my_Div ) };
}

// left params
var containerB = document.getElementById("inputOutput");
var btns = containerB.getElementsByClassName("btn");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";

        let elements = btns[i].getElementsByTagName("*");
        properties.selectedParam = elements[0].innerText;
        updateSurface(elements[0].innerText)
    })
}

function updateCurrents() {
    let mainParams = document.getElementsByClassName("btn");
    let t = properties.t;
    let p = properties.p;

    for (let i = 0; i < mainParams.length; i++) {
        let elements = mainParams[i].getElementsByTagName("*");
        switch (elements[0].innerText) {
            case "Z":
                elements[1].innerText = "= " + toFormat(getZ(t, p));
                break;
            case "Bg":
                elements[1].innerText = "= " + toFormat(getBg(t, p));
                break;
            case "Cg":
                elements[1].innerText = "= " + toFormat(Converter.cPsiaToCatm(getCg(t, p)));
                break;
            case "ρg":
                elements[1].innerText = "= " + toFormat(Converter.lbFt3toKgM3(getRhoG(t, p)));
                break;
            case "μg":
                elements[1].innerText = "= " + toFormat(getMuG(t, p));
                break;
            case "Pb":
                elements[1].innerText = "= " + toFormat(Converter.psiaToAtm(getPb(t)));
                break;
            case "Rs":
                elements[1].innerText = "= " + toFormat(Converter.scfStbToM3M3(getRs(t, p)));
                break;
            case "Bo":
                elements[1].innerText = "= " + toFormat(getBo(t, p));
                break;
            case "Co":
                elements[1].innerText = "= " + toFormat(Converter.cPsiaToCatm(getCo(t, p)));
                break;
            case "ρo":
                elements[1].innerText = "= " + toFormat(Converter.lbFt3toKgM3(getRhoO(t, p)));
                break;
            case "μo":
                elements[1].innerText = "= " + toFormat(getMuO(t, p));
                break;
        }
    }
}

function toFormat(number) {
    let rightPoint = 4;
    let temp = parseFloat(number);
    let ans;
    if ((Math.abs(temp) >= 0.001 & Math.abs(temp) <= 1000) || temp === 0) {
        return ans = parseFloat(temp.toFixed(rightPoint));
    } else {
        return ans = temp.toExponential(rightPoint);
    }
}

function getZ(t, p) {
    return Gas.ZFactor.dranchuk(Converter.fToR(t), properties.tc, p, properties.pc)
}

function getBg(t, p) {
    var z = getZ(t, p);
    return Gas.VolumeFactor.internal(z, Converter.fToR(t), p)
}

function getCg(t, p) {
    var z = getZ(t, p);
    return Gas.Compressibility.dranchuk(z, Converter.fToR(t), properties.tc, p, properties.pc)
}

function getRhoG(t, p) {
    var z = getZ(t, p);
    return Gas.Density.internal(properties.yg, z, Converter.fToR(t), p)
}

function getMuG(t, p) {
    var z = getZ(t, p);
    return Gas.Viscosity.leeEtAl(z, Converter.fToR(t), p, properties.yg)
}

function getPb(t) {
    return Oil.Live.BubblePoint.standing(t, properties.yAPI, properties.yg, properties.rsb);
}

function getRs(t, p) {
    let pb = getPb(t);
    return Oil.Live.GasOilRatio.standing(t, p, pb, properties.yAPI, properties.yg, properties.rsb)
}

function getBo(t, p) {
    let pb = getPb(t);
    let rs = getRs(t, p);
    let coefC = Oil.UnderSaturated.CoefC.vasquezBeggs(t, p, pb, properties.yAPI, properties.yg, properties.rsb);
    return Oil.Live.VolumeFactor.glaso(t, p, pb, properties.yAPI, properties.yg, rs, properties.rsb, coefC)
}

function getCo(t, p) {
    let pb = getPb(t);
    let bo = getBo(t, p);
    let rs = getRs(t, p);
    let dRsDP = Oil.Saturated.DerivativeRsWrtP.standing(t, p, properties.yAPI, properties.yg);
    let dBoDP = Oil.Saturated.derivativeBwrtP.glaso(t, properties.yAPI, properties.yg, rs, dRsDP);
    let bg = getBg(t, p);
    return Oil.Live.Compressibility.vasquezBeggs(t, p, pb, properties.yAPI, properties.yg, bo, properties.rsb, dBoDP, bg, dRsDP)
}

function getRhoO(t, p) {
    let rs = getRs(t, p);
    let bo = getBo(t, p);
    return Oil.Live.Density.internal(properties.yAPI, properties.yg, rs, bo);
}

function getMuO(t, p) {
    let pb = getPb(t);
    let rs = getRs(t, p);
    return Oil.Live.Viscosity.beal(t, p, pb, properties.yAPI, rs, properties.rsb)
}

function getTc() {
    return Gas.PseudoCriticalTemperature.suttonTc(properties.yg)
}

function getPc() {
    return Gas.PseudoCriticalPressure.suttonPc(properties.yg)
}

function updateSurface(clickedParam) {
    let pointsAmount = 50;
    let p = new Array(pointsAmount), t = new Array(pointsAmount), z = new Array(pointsAmount);
    let minP = 14.6959;
    let maxP = 10050;
    let minT = 32;
    let maxT = 752;
    let stepP = (maxP - minP) / (pointsAmount - 1);
    let stepY = (maxT - minT) / (pointsAmount - 1);
    let currentPTemp = minP;
    let currentTTemp = minT;
    let zAxisDescr = clickedParam;

    for (var i = 0; i < pointsAmount; i++) {
        p[i] = currentPTemp;
        t[i] = currentTTemp;
        z[i] = new Array(pointsAmount);
        currentPTemp += stepP;
        currentTTemp += stepY;
    }


    let currentT = properties.t;
    let currentP = properties.p;
    let point;
    // i - temperature
    // j - pressure
    switch (clickedParam) {
        case "Z":
            point = getZ(currentT, currentP);
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = getZ(t[i], p[j])
                }
            }
            break;
        case "Bg":
            zAxisDescr += ", м³/м³";
            point = getBg(currentT, currentP);
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = getBg(t[i], p[j]);
                }
            }
            break;
        case "Cg":
            zAxisDescr += ", атм⁻¹";
            point = Converter.cPsiaToCatm(getCg(currentT, currentP));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.cPsiaToCatm(getCg(t[i], p[j]));
                }
            }
            break;
        case "ρg":
            zAxisDescr += ", кг/м³";
            point = Converter.lbFt3toKgM3(getRhoG(currentT, currentP));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.lbFt3toKgM3(getRhoG(t[i], p[j]));
                }
            }
            break;
        case "μg":
            zAxisDescr += ", сП";
            point = getMuG(currentT, currentP);
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = getMuG(t[i], p[j]);
                }
            }
            break;
        case "Pb":
            zAxisDescr += ", атм";
            point = Converter.psiaToAtm(getPb(currentT));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.psiaToAtm(getPb(t[i]));
                }
            }
            break;
        case "Rs":
            zAxisDescr += ", м³/м³";
            point = Converter.scfStbToM3M3(getRs(currentT, currentP));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.scfStbToM3M3(getRs(t[i], p[j]));
                }
            }
            break;
        case "Bo":
            zAxisDescr += ", м³/м³";
            point = getBo(currentT, currentP);
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = getBo(t[i], p[j]);
                }
            }
            break;
        case "Co":
            zAxisDescr += ", атм⁻¹";
            point = Converter.cPsiaToCatm(getCo(currentT, currentP));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.cPsiaToCatm(getCo(t[i], p[j]));
                }
            }
            break;
        case "ρo":
            zAxisDescr += ", кг/м³";
            point = Converter.lbFt3toKgM3(getRhoO(currentT, currentP));
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = Converter.lbFt3toKgM3(getRhoO(t[i], p[j]));
                }
            }
            break;
        case "μo":
            zAxisDescr += ", сП";
            point = getMuO(currentT, currentP);
            for (let i = 0; i < pointsAmount; i++) {
                for (let j = 0; j < pointsAmount; j++) {
                    z[i][j] = getMuO(t[i], p[j]);
                }
            }
            break;
    }

    for (let i = 0; i < pointsAmount; i++) {
        p[i] = Converter.psiaToAtm(p[i]);
        t[i] = Converter.fToC(t[i]);
    }

    plot(p, t, z, Converter.psiaToAtm(currentP), Converter.fToC(currentT), point, zAxisDescr)
}

function setCurrentInputs() {
    let txtFields = document.getElementsByClassName("txtField");
    let tx = document.getElementsByClassName("rightDescr");

    for (let i = 0; i < txtFields.length; i++) {
        let elements = txtFields[i].getElementsByTagName("*");
        let f = tx[i].getElementsByTagName("*");
        let field = f[0];

        switch (elements[0].innerText) {
            case "P":
                field.value = Converter.psiaToAtm(properties.p);
                break;
            case "T":
                field.value = Converter.fToC(properties.t);
                break;
            case "yg":
                field.value = properties.yg;
                break;
            case "yo":
                field.value = Converter.yAPItoYo(properties.yAPI);
                break;
            case "Rsb":
                field.value = Converter.scfStbToM3M3(properties.rsb);
                break;
        }
    }
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

function setCurrentPseudoProperties() {
    properties.pc = Gas.PseudoCriticalPressure.suttonPc(properties.yg);
    properties.tc = Gas.PseudoCriticalTemperature.suttonTc(properties.yg);
}

setCurrentPseudoProperties();
updateCurrents();
updateSurface("Pb");
setCurrentInputs();

function removePreload() {
    document.getElementById("preload").remove();
    document.getElementById('view').style.opacity = 1
}

setInterval(removePreload, 7000);


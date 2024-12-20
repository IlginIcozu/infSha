/*! For license information please see tonal.js.LICENSE.txt */
var Tonal = function () {
    "use strict";
    "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
    const e = (e, n) => Array(Math.abs(n) + 1).join(e);

    function n(e, n, t) {
        return function (...r) {
            return console.warn(`${e} is deprecated. Use ${n}.`), t.apply(this, r)
        }
    }

    function t(e) {
        return null !== e && "object" == typeof e && "string" == typeof e.name
    }

    function r(e) {
        return null !== e && "object" == typeof e && "number" == typeof e.step && "number" == typeof e.alt
    }
    const o = [0, 2, 4, -1, 1, 3, 5],
        a = o.map((e => Math.floor(7 * e / 12)));

    function m(e) {
        const {
            step: n,
            alt: t,
            oct: r,
            dir: m = 1
        } = e, i = o[n] + 7 * t;
        if (void 0 === r) return [m * i];
        return [m * i, m * (r - a[n] - 4 * t)]
    }
    const i = [3, 0, 4, 1, 5, 2, 6];

    function c(e) {
        const [n, t, r] = e, o = i[function (e) {
            const n = (e + 1) % 7;
            return n < 0 ? 7 + n : n
        }(n)], m = Math.floor((n + 1) / 7);
        if (void 0 === t) return {
            step: o,
            alt: m,
            dir: r
        };
        return {
            step: o,
            alt: m,
            oct: t + 4 * m + a[o],
            dir: r
        }
    }
    const s = {
            empty: !0,
            name: "",
            pc: "",
            acc: ""
        },
        u = new Map,
        l = e => "CDEFGAB".charAt(e),
        d = n => n < 0 ? e("b", -n) : e("#", n),
        P = e => "b" === e[0] ? -e.length : e.length;

    function M(e) {
        const n = u.get(e);
        if (n) return n;
        const o = "string" == typeof e ? function (e) {
            const n = p(e);
            if ("" === n[0] || "" !== n[3]) return s;
            const t = n[0],
                r = n[1],
                o = n[2],
                a = (t.charCodeAt(0) + 3) % 7,
                i = P(r),
                c = o.length ? +o : void 0,
                u = m({
                    step: a,
                    alt: i,
                    oct: c
                }),
                l = t + r + o,
                d = t + r,
                M = (y[a] + i + 120) % 12,
                f = void 0 === c ? (g = y[a] + i, A = 12, (g % A + A) % A - 1188) : y[a] + i + 12 * (c + 1),
                h = f >= 0 && f <= 127 ? f : null,
                b = void 0 === c ? null : 440 * Math.pow(2, (f - 69) / 12);
            var g, A;
            return {
                empty: !1,
                acc: r,
                alt: i,
                chroma: M,
                coord: u,
                freq: b,
                height: f,
                letter: t,
                midi: h,
                name: l,
                oct: c,
                pc: d,
                step: a
            }
        }(e) : r(e) ? M(function (e) {
            const {
                step: n,
                alt: t,
                oct: r
            } = e, o = l(n);
            if (!o) return "";
            const a = o + d(t);
            return r || 0 === r ? a + r : a
        }(e)) : t(e) ? M(e.name) : s;
        return u.set(e, o), o
    }
    const f = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

    function p(e) {
        const n = f.exec(e);
        return [n[1].toUpperCase(), n[2].replace(/x/g, "##"), n[3], n[4]]
    }

    function h(e) {
        return M(c(e))
    }
    const y = [0, 2, 4, 5, 7, 9, 11];
    const b = {
            empty: !0,
            name: "",
            acc: ""
        },
        g = new RegExp("^([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})|(AA|A|P|M|m|d|dd)([-+]?\\d+)$");

    function A(e) {
        const n = g.exec(`${e}`);
        return null === n ? ["", ""] : n[1] ? [n[1], n[2]] : [n[4], n[3]]
    }
    const v = {};

    function j(n) {
        return "string" == typeof n ? v[n] || (v[n] = function (e) {
            const n = A(e);
            if ("" === n[0]) return b;
            const t = +n[0],
                r = n[1],
                o = (Math.abs(t) - 1) % 7,
                a = N[o];
            if ("M" === a && "P" === r) return b;
            const i = "M" === a ? "majorable" : "perfectable",
                c = "" + t + r,
                s = t < 0 ? -1 : 1,
                u = 8 === t || -8 === t ? t : s * (o + 1),
                l = function (e, n) {
                    return "M" === n && "majorable" === e || "P" === n && "perfectable" === e ? 0 : "m" === n && "majorable" === e ? -1 : /^A+$/.test(n) ? n.length : /^d+$/.test(n) ? -1 * ("perfectable" === e ? n.length : n.length + 1) : 0
                }(i, r),
                d = Math.floor((Math.abs(t) - 1) / 7),
                P = s * (I[o] + l + 12 * d),
                M = (s * (I[o] + l) % 12 + 12) % 12,
                f = m({
                    step: o,
                    alt: l,
                    oct: d,
                    dir: s
                });
            return {
                empty: !1,
                name: c,
                num: t,
                q: r,
                step: o,
                alt: l,
                dir: s,
                type: i,
                simple: u,
                semitones: P,
                chroma: M,
                coord: f,
                oct: d
            }
        }(n)) : r(n) ? j(function (n) {
            const {
                step: t,
                alt: r,
                oct: o = 0,
                dir: a
            } = n;
            if (!a) return "";
            const m = t + 1 + 7 * o;
            return (a < 0 ? "-" : "") + (0 === m ? t + 1 : m) + function (n, t) {
                return 0 === t ? "majorable" === n ? "M" : "P" : -1 === t && "majorable" === n ? "m" : t > 0 ? e("A", t) : e("d", "perfectable" === n ? t : t + 1)
            }("M" === N[t] ? "majorable" : "perfectable", r)
        }(n)) : t(n) ? j(n.name) : b
    }
    const I = [0, 2, 4, 5, 7, 9, 11],
        N = "PMMPPMM";

    function O(e, n) {
        const [t, r = 0] = e;
        return j(c(n || 7 * t + 12 * r < 0 ? [-t, -r, -1] : [t, r, 1]))
    }

    function x(e, n) {
        const t = M(e),
            r = j(n);
        if (t.empty || r.empty) return "";
        const o = t.coord,
            a = r.coord;
        return h(1 === o.length ? [o[0] + a[0]] : [o[0] + a[0], o[1] + a[1]]).name
    }

    function T(e, n) {
        const t = M(e),
            r = M(n);
        if (t.empty || r.empty) return "";
        const o = t.coord,
            a = r.coord,
            m = a[0] - o[0];
        return O([m, 2 === o.length && 2 === a.length ? a[1] - o[1] : -Math.floor(7 * m / 12)], r.height === t.height && null !== r.midi && null !== t.midi && t.step > r.step).name
    }
    var w = Object.freeze({
        __proto__: null,
        accToAlt: P,
        altToAcc: d,
        coordToInterval: O,
        coordToNote: h,
        decode: c,
        deprecate: n,
        distance: T,
        encode: m,
        fillStr: e,
        interval: j,
        isNamed: t,
        isPitch: r,
        note: M,
        stepToLetter: l,
        tokenizeInterval: A,
        tokenizeNote: p,
        transpose: x
    });
    const D = (e, n) => Array(n + 1).join(e),
        S = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

    function C(e) {
        const n = S.exec(e);
        return n ? [n[1], n[2], n[3]] : ["", "", ""]
    }

    function V(e) {
        const [n, t, r] = C(e);
        if ("" === t) return "";
        let o = 4;
        for (let e = 0; e < r.length; e++) o += "," === r.charAt(e) ? -1 : 1;
        const a = "_" === n[0] ? n.replace(/_/g, "b") : "^" === n[0] ? n.replace(/\^/g, "#") : "";
        return t.charCodeAt(0) > 96 ? t.toUpperCase() + a + (o + 1) : t + a + o
    }

    function $(e) {
        const n = M(e);
        if (n.empty || !n.oct && 0 !== n.oct) return "";
        const {
            letter: t,
            acc: r,
            oct: o
        } = n;
        return ("b" === r[0] ? r.replace(/b/g, "_") : r.replace(/#/g, "^")) + (o > 4 ? t.toLowerCase() : t) + (5 === o ? "" : o > 4 ? D("'", o - 5) : D(",", 4 - o))
    }
    var q = {
        abcToScientificNotation: V,
        scientificToAbcNotation: $,
        tokenize: C,
        transpose: function (e, n) {
            return $(x(V(e), n))
        },
        distance: function (e, n) {
            return T(V(e), V(n))
        }
    };

    function k(e) {
        return e.map((e => M(e))).filter((e => !e.empty)).sort(((e, n) => e.height - n.height)).map((e => e.name))
    }
    var E = Object.freeze({
        __proto__: null,
        compact: function (e) {
            return e.filter((e => 0 === e || e))
        },
        permutations: function e(n) {
            return 0 === n.length ? [
                []
            ] : e(n.slice(1)).reduce(((e, t) => e.concat(n.map(((e, r) => {
                const o = t.slice();
                return o.splice(r, 0, n[0]), o
            })))), [])
        },
        range: function (e, n) {
            return e < n ? function (e, n) {
                const t = [];
                for (; n--; t[n] = n + e);
                return t
            }(e, n - e + 1) : function (e, n) {
                const t = [];
                for (; n--; t[n] = e - n);
                return t
            }(e, e - n + 1)
        },
        rotate: function (e, n) {
            const t = n.length,
                r = (e % t + t) % t;
            return n.slice(r, t).concat(n.slice(0, r))
        },
        shuffle: function (e, n = Math.random) {
            let t, r, o = e.length;
            for (; o;) t = Math.floor(n() * o--), r = e[o], e[o] = e[t], e[t] = r;
            return e
        },
        sortedNoteNames: k,
        sortedUniqNoteNames: function (e) {
            return k(e).filter(((e, n, t) => 0 === n || e !== t[n - 1]))
        }
    });

    function _(e, n) {
        return e < n ? function (e, n) {
            const t = [];
            for (; n--; t[n] = n + e);
            return t
        }(e, n - e + 1) : function (e, n) {
            const t = [];
            for (; n--; t[n] = e - n);
            return t
        }(e, e - n + 1)
    }

    function F(e, n) {
        const t = n.length,
            r = (e % t + t) % t;
        return n.slice(r, t).concat(n.slice(0, r))
    }

    function z(e) {
        return e.filter((e => 0 === e || e))
    }
    var R = {
        compact: z,
        permutations: function e(n) {
            return 0 === n.length ? [
                []
            ] : e(n.slice(1)).reduce(((e, t) => e.concat(n.map(((e, r) => {
                const o = t.slice();
                return o.splice(r, 0, n[0]), o
            })))), [])
        },
        range: _,
        rotate: F,
        shuffle: function (e, n = Math.random) {
            let t, r, o = e.length;
            for (; o;) t = Math.floor(n() * o--), r = e[o], e[o] = e[t], e[t] = r;
            return e
        }
    };
    const U = {
            empty: !0,
            name: "",
            setNum: 0,
            chroma: "000000000000",
            normalized: "000000000000",
            intervals: []
        },
        B = e => Number(e).toString(2),
        G = e => parseInt(e, 2),
        K = /^[01]{12}$/;

    function L(e) {
        return K.test(e)
    }
    const H = {
        [U.chroma]: U
    };

    function J(e) {
        const n = L(e) ? e : "number" == typeof (t = e) && t >= 0 && t <= 4095 ? B(e) : Array.isArray(e) ? function (e) {
            if (0 === e.length) return U.chroma;
            let n;
            const t = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let r = 0; r < e.length; r++) n = M(e[r]), n.empty && (n = j(e[r])), n.empty || (t[n.chroma] = 1);
            return t.join("")
        }(e) : (e => e && L(e.chroma))(e) ? e.chroma : U.chroma;
        var t;
        return H[n] = H[n] || function (e) {
            const n = G(e),
                t = function (e) {
                    const n = e.split("");
                    return n.map(((e, t) => F(t, n).join("")))
                }(e).map(G).filter((e => e >= 2048)).sort()[0],
                r = B(t),
                o = function (e) {
                    const n = [];
                    for (let t = 0; t < 12; t++) "1" === e.charAt(t) && n.push(W[t]);
                    return n
                }(e);
            return {
                empty: !1,
                name: "",
                setNum: n,
                chroma: e,
                normalized: r,
                intervals: o
            }
        }(n)
    }
    const Q = n("Pcset.pcset", "Pcset.get", J),
        W = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"];

    function X(e, n = !0) {
        const t = J(e).chroma.split("");
        return z(t.map(((e, r) => {
            const o = F(r, t);
            return n && "0" === o[0] ? null : o.join("")
        })))
    }

    function Y(e) {
        const n = J(e).setNum;
        return e => {
            const t = J(e).setNum;
            return n && n !== t && (t & n) === t
        }
    }

    function Z(e) {
        const n = J(e).setNum;
        return e => {
            const t = J(e).setNum;
            return n && n !== t && (t | n) === t
        }
    }

    function ee(e) {
        const n = J(e);
        return e => {
            const t = M(e);
            return n && !t.empty && "1" === n.chroma.charAt(t.chroma)
        }
    }
    var ne = {
        get: J,
        chroma: e => J(e).chroma,
        num: e => J(e).setNum,
        intervals: e => J(e).intervals,
        chromas: function () {
            return _(2048, 4095).map(B)
        },
        isSupersetOf: Z,
        isSubsetOf: Y,
        isNoteIncludedIn: ee,
        isEqual: function (e, n) {
            return J(e).setNum === J(n).setNum
        },
        filter: function (e) {
            const n = ee(e);
            return e => e.filter(n)
        },
        modes: X,
        pcset: Q
    };
    const te = {
        ...U,
        name: "",
        quality: "Unknown",
        intervals: [],
        aliases: []
    };
    let re = [],
        oe = {};

    function ae(e) {
        return oe[e] || te
    }
    const me = n("ChordType.chordType", "ChordType.get", ae);

    function ie() {
        return re.slice()
    }
    const ce = n("ChordType.entries", "ChordType.all", ie);

    function se(e, n, t) {
        const r = function (e) {
                const n = n => -1 !== e.indexOf(n);
                return n("5A") ? "Augmented" : n("3M") ? "Major" : n("5d") ? "Diminished" : n("3m") ? "Minor" : "Unknown"
            }(e),
            o = {
                ...J(e),
                name: t || "",
                quality: r,
                intervals: e,
                aliases: n
            };
        re.push(o), o.name && (oe[o.name] = o), oe[o.setNum] = o, oe[o.chroma] = o, o.aliases.forEach((e => function (e, n) {
            oe[n] = e
        }(o, e)))
    } [
        ["1P 3M 5P", "major", "M ^ "],
        ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
        ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
        ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
        ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
        ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"],
        ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
        ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"],
        ["1P 3m 5P", "minor", "m min -"],
        ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
        ["1P 3m 5P 7M", "minor/major seventh", "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"],
        ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
        ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
        ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
        ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
        ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
        ["1P 3m 5d", "diminished", "dim ° o"],
        ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
        ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
        ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
        ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
        ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
        ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
        ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
        ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
        ["1P 3M 7m 9m", "altered", "alt7"],
        ["1P 4P 5P", "suspended fourth", "sus4 sus"],
        ["1P 2M 5P", "suspended second", "sus2"],
        ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
        ["1P 5P 7m 9M 11P", "eleventh", "11"],
        ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"],
        ["1P 5P", "fifth", "5"],
        ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
        ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
        ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
        ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 Δ9#11 ^9#11"],
        ["1P 2M 4P 5P", "", "sus24 sus4add9"],
        ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
        ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
        ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
        ["1P 3M 5A 7m 9M", "", "9#5 9+"],
        ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
        ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
        ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
        ["1P 3M 5A 9A", "", "+add#9"],
        ["1P 3M 5A 9M", "", "M#5add9 +add9"],
        ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
        ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
        ["1P 3M 5P 6M 9M 11A", "", "69#11"],
        ["1P 3m 5P 6M 9M", "", "m69 -69"],
        ["1P 3M 5P 6m 7m", "", "7b6"],
        ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
        ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
        ["1P 3M 5P 7M 9m", "", "M7b9"],
        ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
        ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
        ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
        ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
        ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
        ["1P 3M 5P 7m 9A 13M", "", "13#9"],
        ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
        ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
        ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
        ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
        ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
        ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
        ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
        ["1P 3M 5P 7m 9m 13M", "", "13b9"],
        ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
        ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
        ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
        ["1P 3M 5P 9m", "", "Maddb9"],
        ["1P 3M 5d", "", "Mb5"],
        ["1P 3M 5d 6M 7m 9M", "", "13b5"],
        ["1P 3M 5d 7M", "", "M7b5"],
        ["1P 3M 5d 7M 9M", "", "M9b5"],
        ["1P 3M 5d 7m", "", "7b5"],
        ["1P 3M 5d 7m 9M", "", "9b5"],
        ["1P 3M 7m", "", "7no5"],
        ["1P 3M 7m 13m", "", "7b13"],
        ["1P 3M 7m 9M", "", "9no5"],
        ["1P 3M 7m 9M 13M", "", "13no5"],
        ["1P 3M 7m 9M 13m", "", "9b13"],
        ["1P 3m 4P 5P", "", "madd4"],
        ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
        ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
        ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
        ["1P 3m 5P 9M", "", "madd9"],
        ["1P 3m 5d 6M 7M", "", "o7M7"],
        ["1P 3m 5d 7M", "", "oM7"],
        ["1P 3m 6m 7M", "", "mb6M7"],
        ["1P 3m 6m 7m", "", "m7#5"],
        ["1P 3m 6m 7m 9M", "", "m9#5"],
        ["1P 3m 5A 7m 9M 11P", "", "m11A"],
        ["1P 3m 6m 9m", "", "mb6b9"],
        ["1P 2M 3m 5d 7m", "", "m9b5"],
        ["1P 4P 5A 7M", "", "M7#5sus4"],
        ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
        ["1P 4P 5A 7m", "", "7#5sus4"],
        ["1P 4P 5P 7M", "", "M7sus4"],
        ["1P 4P 5P 7M 9M", "", "M9sus4"],
        ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
        ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
        ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
        ["1P 4P 7m 10m", "", "4 quartal"],
        ["1P 5P 7m 9m 11P", "", "11b9"]
    ].forEach((([e, n, t]) => se(e.split(" "), t.split(" "), n))), re.sort(((e, n) => e.setNum - n.setNum));
    var ue = {
        names: function () {
            return re.map((e => e.name)).filter((e => e))
        },
        symbols: function () {
            return re.map((e => e.aliases[0])).filter((e => e))
        },
        get: ae,
        all: ie,
        add: se,
        removeAll: function () {
            re = [], oe = {}
        },
        keys: function () {
            return Object.keys(oe)
        },
        entries: ce,
        chordType: me
    };
    const le = {
        ...U,
        intervals: [],
        aliases: []
    };
    let de = [],
        Pe = {};

    function Me() {
        return de.map((e => e.name))
    }

    function fe(e) {
        return Pe[e] || le
    }
    const pe = n("ScaleDictionary.scaleType", "ScaleType.get", fe);

    function he() {
        return de.slice()
    }
    const ye = n("ScaleDictionary.entries", "ScaleType.all", he);

    function be(e, n, t = []) {
        const r = {
            ...J(e),
            name: n,
            intervals: e,
            aliases: t
        };
        return de.push(r), Pe[r.name] = r, Pe[r.setNum] = r, Pe[r.chroma] = r, r.aliases.forEach((e => function (e, n) {
            Pe[n] = e
        }(r, e))), r
    } [
        ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
        ["1P 3M 4P 5P 7M", "ionian pentatonic"],
        ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
        ["1P 2M 4P 5P 6M", "ritusen"],
        ["1P 2M 4P 5P 7m", "egyptian"],
        ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
        ["1P 3m 4P 5P 6m", "vietnamese 1"],
        ["1P 2m 3m 5P 6m", "pelog"],
        ["1P 2m 4P 5P 6m", "kumoijoshi"],
        ["1P 2M 3m 5P 6m", "hirajoshi"],
        ["1P 2m 4P 5d 7m", "iwato"],
        ["1P 2m 4P 5P 7m", "in-sen"],
        ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
        ["1P 3m 4P 6m 7m", "malkos raga"],
        ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
        ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
        ["1P 3m 4P 5P 6M", "minor six pentatonic"],
        ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
        ["1P 2M 3M 5P 6m", "flat six pentatonic"],
        ["1P 2m 3M 5P 6M", "scriabin"],
        ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
        ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
        ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
        ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
        ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
        ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
        ["1P 2A 3M 5P 5A 7M", "augmented"],
        ["1P 2M 3m 3M 5P 6M", "major blues"],
        ["1P 2M 4P 5P 6M 7m", "piongio"],
        ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
        ["1P 2M 3M 4A 6M 7m", "prometheus"],
        ["1P 2m 3M 5d 6m 7m", "mystery #1"],
        ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
        ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"],
        ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
        ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
        ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
        ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
        ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
        ["1P 2m 2A 3M 4A 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"],
        ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
        ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"],
        ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
        ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
        ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
        ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"],
        ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
        ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
        ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "superlocrian diminished"],
        ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
        ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
        ["1P 2M 3m 4A 5P 6M 7m", "dorian #4", "ukrainian dorian", "romanian minor", "altered dorian"],
        ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
        ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
        ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
        ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
        ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
        ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
        ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
        ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"],
        ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
        ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
        ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
        ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
        ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
        ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
        ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
        ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
        ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
        ["1P 2m 3M 4P 5d 6m 7M", "persian"],
        ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
        ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
        ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"],
        ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
        ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
        ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
        ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
        ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
        ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
        ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
        ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
        ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
        ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
        ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
        ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
        ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"],
        ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
        ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
        ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
        ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
        ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
        ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
    ].forEach((([e, n, ...t]) => be(e.split(" "), n, t)));
    var ge = {
        names: Me,
        get: fe,
        all: he,
        add: be,
        removeAll: function () {
            de = [], Pe = {}
        },
        keys: function () {
            return Object.keys(Pe)
        },
        entries: ye,
        scaleType: pe
    };
    const Ae = {
            empty: !0,
            name: "",
            symbol: "",
            root: "",
            rootDegree: 0,
            type: "",
            tonic: null,
            setNum: NaN,
            quality: "Unknown",
            chroma: "",
            normalized: "",
            aliases: [],
            notes: [],
            intervals: []
        },
        ve = /^(6|64|7|9|11|13)$/;

    function je(e) {
        const [n, t, r, o] = p(e);
        return "" === n ? ["", e] : "A" === n && "ug" === o ? ["", "aug"] : o || "4" !== r && "5" !== r ? ve.test(r) ? [n + t, r + o] : [n + t + r, o] : [n + t, r]
    }

    function Ie(e) {
        if ("" === e) return Ae;
        if (Array.isArray(e) && 2 === e.length) return Ne(e[1], e[0]); {
            const [n, t] = je(e), r = Ne(t, n);
            return r.empty ? Ne(e) : r
        }
    }

    function Ne(e, n, t) {
        const r = ae(e),
            o = M(n || ""),
            a = M(t || "");
        if (r.empty || n && o.empty || t && a.empty) return Ae;
        const m = T(o.pc, a.pc),
            i = r.intervals.indexOf(m) + 1;
        if (!a.empty && !i) return Ae;
        const c = Array.from(r.intervals);
        for (let e = 1; e < i; e++) {
            const e = c[0][0],
                n = c[0][1],
                t = parseInt(e, 10) + 7;
            c.push(`${t}${n}`), c.shift()
        }
        const s = o.empty ? [] : c.map((e => x(o, e)));
        e = -1 !== r.aliases.indexOf(e) ? e : r.aliases[0];
        const u = `${o.empty?"":o.pc}${e}${a.empty||i<=1?"":"/"+a.pc}`,
            l = `${n?o.pc+" ":""}${r.name}${i>1&&t?" over "+a.pc:""}`;
        return {
            ...r,
            name: l,
            symbol: u,
            type: r.name,
            root: a.name,
            intervals: c,
            rootDegree: i,
            tonic: o.name,
            notes: s
        }
    }
    var Oe = {
        getChord: Ne,
        get: Ie,
        detect: function (e) {
            const n = e.map((e => M(e).pc)).filter((e => e));
            return 0 === M.length ? [] : function (e, n) {
                const t = e[0],
                    r = M(t).chroma,
                    o = (e => {
                        const n = e.reduce(((e, n) => {
                            const t = M(n).chroma;
                            return void 0 !== t && (e[t] = e[t] || M(n).name), e
                        }), {});
                        return e => n[e]
                    })(e),
                    a = X(e, !1),
                    m = [];
                return a.forEach(((e, a) => {
                    ie().filter((n => n.chroma === e)).forEach((e => {
                        const i = e.aliases[0],
                            c = o(a);
                        a !== r ? m.push({
                            weight: .5 * n,
                            name: `${c}${i}/${t}`
                        }) : m.push({
                            weight: 1 * n,
                            name: `${c}${i}`
                        })
                    }))
                })), m
            }(n, 1).filter((e => e.weight)).sort(((e, n) => n.weight - e.weight)).map((e => e.name))
        },
        chordScales: function (e) {
            const n = Z(Ie(e).chroma);
            return he().filter((e => n(e.chroma))).map((e => e.name))
        },
        extended: function (e) {
            const n = Ie(e),
                t = Z(n.chroma);
            return ie().filter((e => t(e.chroma))).map((e => n.tonic + e.aliases[0]))
        },
        reduced: function (e) {
            const n = Ie(e),
                t = Y(n.chroma);
            return ie().filter((e => t(e.chroma))).map((e => n.tonic + e.aliases[0]))
        },
        tokenize: je,
        transpose: function (e, n) {
            const [t, r] = je(e);
            return t ? x(t, n) + r : e
        },
        chord: n("Chord.chord", "Chord.get", Ie)
    };
    const xe = [];
    [
        [.125, "dl", ["large", "duplex longa", "maxima", "octuple", "octuple whole"]],
        [.25, "l", ["long", "longa"]],
        [.5, "d", ["double whole", "double", "breve"]],
        [1, "w", ["whole", "semibreve"]],
        [2, "h", ["half", "minim"]],
        [4, "q", ["quarter", "crotchet"]],
        [8, "e", ["eighth", "quaver"]],
        [16, "s", ["sixteenth", "semiquaver"]],
        [32, "t", ["thirty-second", "demisemiquaver"]],
        [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
        [128, "h", ["hundred twenty-eighth"]],
        [256, "th", ["two hundred fifty-sixth"]]
    ].forEach((([e, n, t]) => function (e, n, t) {
        xe.push({
            empty: !1,
            dots: "",
            name: "",
            value: 1 / e,
            fraction: e < 1 ? [1 / e, 1] : [1, e],
            shorthand: n,
            names: t
        })
    }(e, n, t)));
    const Te = {
        empty: !0,
        name: "",
        value: 0,
        fraction: [0, 0],
        shorthand: "",
        dots: "",
        names: []
    };
    const we = /^([^.]+)(\.*)$/;

    function De(e) {
        const [n, t, r] = we.exec(e) || [], o = xe.find((e => e.shorthand === t || e.names.includes(t)));
        if (!o) return Te;
        const a = function (e, n) {
                const t = Math.pow(2, n);
                let r = e[0] * t,
                    o = e[1] * t;
                const a = r;
                for (let e = 0; e < n; e++) r += a / Math.pow(2, e + 1);
                for (; r % 2 == 0 && o % 2 == 0;) r /= 2, o /= 2;
                return [r, o]
            }(o.fraction, r.length),
            m = a[0] / a[1];
        return {
            ...o,
            name: e,
            dots: r,
            value: m,
            fraction: a
        }
    }
    var Se = {
        names: function () {
            return xe.reduce(((e, n) => (n.names.forEach((n => e.push(n))), e)), [])
        },
        shorthands: function () {
            return xe.map((e => e.shorthand))
        },
        get: De,
        value: e => De(e).value,
        fraction: e => De(e).fraction
    };
    const Ce = j;

    function Ve(e) {
        const n = j(e);
        return n.empty ? "" : n.simple + n.q
    }
    const $e = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7],
        qe = "P m M m M P d P m M m M".split(" ");
    const ke = T,
        Ee = Re(((e, n) => [e[0] + n[0], e[1] + n[1]])),
        _e = Re(((e, n) => [e[0] - n[0], e[1] - n[1]]));

    function Fe(e, n) {
        const t = Ce(e);
        if (t.empty) return "";
        const [r, o, a] = t.coord;
        return O([r + n, o, a]).name
    }
    var ze = {
        names: function () {
            return "1P 2M 3M 4P 5P 6m 7m".split(" ")
        },
        get: Ce,
        name: e => j(e).name,
        num: e => j(e).num,
        semitones: e => j(e).semitones,
        quality: e => j(e).q,
        fromSemitones: function (e) {
            const n = e < 0 ? -1 : 1,
                t = Math.abs(e),
                r = t % 12,
                o = Math.floor(t / 12);
            return n * ($e[r] + 7 * o) + qe[r]
        },
        distance: ke,
        invert: function (e) {
            const n = j(e);
            return n.empty ? "" : j({
                step: (7 - n.step) % 7,
                alt: "perfectable" === n.type ? -n.alt : -(n.alt + 1),
                oct: n.oct,
                dir: n.dir
            }).name
        },
        simplify: Ve,
        add: Ee,
        addTo: e => n => Ee(e, n),
        substract: _e,
        transposeFifths: Fe
    };

    function Re(e) {
        return (n, t) => {
            const r = j(n).coord,
                o = j(t).coord;
            if (r && o) {
                return O(e(r, o)).name
            }
        }
    }

    function Ue(e) {
        return +e >= 0 && +e <= 127
    }

    function Be(e) {
        if (Ue(e)) return +e;
        const n = M(e);
        return n.empty ? null : n.midi
    }
    const Ge = Math.log(2),
        Ke = Math.log(440);

    function Le(e) {
        const n = 12 * (Math.log(e) - Ke) / Ge + 69;
        return Math.round(100 * n) / 100
    }
    const He = "C C# D D# E F F# G G# A A# B".split(" "),
        Je = "C Db D Eb E F Gb G Ab A Bb B".split(" ");

    function Qe(e, n = {}) {
        if (isNaN(e) || e === -1 / 0 || e === 1 / 0) return "";
        e = Math.round(e);
        const t = (!0 === n.sharps ? He : Je)[e % 12];
        if (n.pitchClass) return t;
        return t + (Math.floor(e / 12) - 1)
    }
    var We = {
        isMidi: Ue,
        toMidi: Be,
        midiToFreq: function (e, n = 440) {
            return Math.pow(2, (e - 69) / 12) * n
        },
        midiToNoteName: Qe,
        freqToMidi: Le
    };
    const Xe = ["C", "D", "E", "F", "G", "A", "B"],
        Ye = e => e.name,
        Ze = e => e.map(M).filter((e => !e.empty));
    const en = M;

    function nn(e) {
        return Qe(e)
    }
    const tn = x,
        rn = e => n => tn(n, e),
        on = e => n => tn(e, n);

    function an(e, n) {
        const t = en(e);
        if (t.empty) return "";
        const [r, o] = t.coord;
        return h(void 0 === o ? [r + n] : [r + n, o]).name
    }
    const mn = (e, n) => e.height - n.height;

    function cn(e, n) {
        return n = n || mn, Ze(e).sort(n).map(Ye)
    }

    function sn(e) {
        return cn(e, mn).filter(((e, n, t) => 0 === n || e !== t[n - 1]))
    }

    function un(e, n) {
        const t = en(e);
        if (t.empty) return "";
        const r = en(n || Qe(t.midi || t.chroma, {
            sharps: t.alt < 0,
            pitchClass: !0
        }));
        if (r.empty || r.chroma !== t.chroma) return "";
        if (void 0 === t.oct) return r.pc;
        const o = t.chroma - t.alt,
            a = r.chroma - r.alt,
            m = o > 11 || a < 0 ? -1 : o < 0 || a > 11 ? 1 : 0,
            i = t.oct + m;
        return r.pc + i
    }
    var ln = {
        names: function (e) {
            return void 0 === e ? Xe.slice() : Array.isArray(e) ? Ze(e).map(Ye) : []
        },
        get: en,
        name: e => en(e).name,
        pitchClass: e => en(e).pc,
        accidentals: e => en(e).acc,
        octave: e => en(e).oct,
        midi: e => en(e).midi,
        ascending: mn,
        descending: (e, n) => n.height - e.height,
        sortedNames: cn,
        sortedUniqNames: sn,
        fromMidi: nn,
        fromMidiSharps: function (e) {
            return Qe(e, {
                sharps: !0
            })
        },
        freq: e => en(e).freq,
        fromFreq: function (e) {
            return Qe(Le(e))
        },
        fromFreqSharps: function (e) {
            return Qe(Le(e), {
                sharps: !0
            })
        },
        chroma: e => en(e).chroma,
        transpose: tn,
        tr: x,
        transposeBy: rn,
        trBy: rn,
        transposeFrom: on,
        trFrom: on,
        transposeFifths: an,
        trFifths: an,
        simplify: e => {
            const n = en(e);
            return n.empty ? "" : Qe(n.midi || n.chroma, {
                sharps: n.alt > 0,
                pitchClass: null === n.midi
            })
        },
        enharmonic: un
    };
    const dn = {
            empty: !0,
            name: "",
            chordType: ""
        },
        Pn = {};

    function Mn(e) {
        return "string" == typeof e ? Pn[e] || (Pn[e] = function (e) {
            const [n, t, r, o] = (a = e, pn.exec(a) || ["", "", "", ""]);
            var a;
            if (!r) return dn;
            const m = r.toUpperCase(),
                i = yn.indexOf(m),
                c = P(t),
                s = 1;
            return {
                empty: !1,
                name: n,
                roman: r,
                interval: j({
                    step: i,
                    alt: c,
                    dir: s
                }).name,
                acc: t,
                chordType: o,
                alt: c,
                step: i,
                major: r === m,
                oct: 0,
                dir: s
            }
        }(e)) : "number" == typeof e ? Mn(yn[e] || "") : r(e) ? Mn(d((n = e).alt) + yn[n.step]) : t(e) ? Mn(e.name) : dn;
        var n
    }
    const fn = n("RomanNumeral.romanNumeral", "RomanNumeral.get", Mn);
    const pn = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
    const hn = "I II III IV V VI VII",
        yn = hn.split(" "),
        bn = hn.toLowerCase().split(" ");
    var gn = {
        names: function (e = !0) {
            return (e ? yn : bn).slice()
        },
        get: Mn,
        romanNumeral: fn
    };
    const An = Object.freeze([]),
        vn = {
            type: "major",
            tonic: "",
            alteration: 0,
            keySignature: ""
        },
        jn = {
            tonic: "",
            grades: An,
            intervals: An,
            scale: An,
            chords: An,
            chordsHarmonicFunction: An,
            chordScales: An
        },
        In = {
            ...vn,
            ...jn,
            type: "major",
            minorRelative: "",
            scale: An,
            secondaryDominants: An,
            secondaryDominantsMinorRelative: An,
            substituteDominants: An,
            substituteDominantsMinorRelative: An
        },
        Nn = {
            ...vn,
            type: "minor",
            relativeMajor: "",
            natural: jn,
            harmonic: jn,
            melodic: jn
        },
        On = (e, n, t = "") => n.map(((n, r) => `${e[r]}${t}${n}`));

    function xn(e, n, t, r) {
        return o => {
            const a = e.map((e => Mn(e).interval || "")),
                m = a.map((e => x(o, e)));
            return {
                tonic: o,
                grades: e,
                intervals: a,
                scale: m,
                chords: On(m, n),
                chordsHarmonicFunction: t.slice(),
                chordScales: On(m, r, " ")
            }
        }
    }
    const Tn = (e, n) => {
            const t = M(e),
                r = M(n);
            return t.empty || r.empty ? 0 : r.coord[0] - t.coord[0]
        },
        wn = xn("I II III IV V VI VII".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")),
        Dn = xn("I II bIII IV V bVI bVII".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")),
        Sn = xn("I II bIII IV V bVI VII".split(" "), "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "), "T SD T SD D SD D".split(" "), "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(",")),
        Cn = xn("I II bIII IV V VI VII".split(" "), "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "), "T SD T SD D  ".split(" "), "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(","));
    var Vn = {
        majorKey: function (e) {
            const n = M(e).pc;
            if (!n) return In;
            const t = wn(n),
                r = Tn("C", n),
                o = n => {
                    const t = Mn(n);
                    return t.empty ? "" : x(e, t.interval) + t.chordType
                };
            return {
                ...t,
                type: "major",
                minorRelative: x(n, "-3m"),
                alteration: r,
                keySignature: d(r),
                secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(o),
                secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ").map(o),
                substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ").map(o),
                substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ").map(o)
            }
        },
        majorTonicFromKeySignature: function (e) {
            return "number" == typeof e ? an("C", e) : "string" == typeof e && /^b+|#+$/.test(e) ? an("C", P(e)) : null
        },
        minorKey: function (e) {
            const n = M(e).pc;
            if (!n) return Nn;
            const t = Tn("C", n) - 3;
            return {
                type: "minor",
                tonic: n,
                relativeMajor: x(n, "3m"),
                alteration: t,
                keySignature: d(t),
                natural: Dn(n),
                harmonic: Sn(n),
                melodic: Cn(n)
            }
        }
    };
    const $n = [
            [0, 2773, 0, "ionian", "", "Maj7", "major"],
            [1, 2902, 2, "dorian", "m", "m7"],
            [2, 3418, 4, "phrygian", "m", "m7"],
            [3, 2741, -1, "lydian", "", "Maj7"],
            [4, 2774, 1, "mixolydian", "", "7"],
            [5, 2906, 3, "aeolian", "m", "m7", "minor"],
            [6, 3434, 5, "locrian", "dim", "m7b5"]
        ],
        qn = {
            ...U,
            name: "",
            alt: 0,
            modeNum: NaN,
            triad: "",
            seventh: "",
            aliases: []
        },
        kn = $n.map((function (e) {
            const [n, t, r, o, a, m, i] = e, c = i ? [i] : [], s = Number(t).toString(2);
            return {
                empty: !1,
                intervals: fe(o).intervals,
                modeNum: n,
                chroma: s,
                normalized: s,
                name: o,
                setNum: t,
                alt: r,
                triad: a,
                seventh: m,
                aliases: c
            }
        })),
        En = {};

    function _n(e) {
        return "string" == typeof e ? En[e.toLowerCase()] || qn : e && e.name ? _n(e.name) : qn
    }
    kn.forEach((e => {
        En[e.name] = e, e.aliases.forEach((n => {
            En[n] = e
        }))
    }));
    const Fn = n("Mode.mode", "Mode.get", _n);

    function zn() {
        return kn.slice()
    }
    const Rn = n("Mode.mode", "Mode.all", zn);

    function Un(e) {
        return (n, t) => {
            const r = _n(n);
            if (r.empty) return [];
            const o = F(r.modeNum, e),
                a = r.intervals.map((e => x(t, e)));
            return o.map(((e, n) => a[n] + e))
        }
    }

    function Bn(e, n) {
        const t = _n(n),
            r = _n(e);
        return t.empty || r.empty ? "" : Ve(Fe("1P", r.alt - t.alt))
    }
    var Gn = {
        get: _n,
        names: function () {
            return kn.map((e => e.name))
        },
        all: zn,
        distance: Bn,
        relativeTonic: function (e, n, t) {
            return x(t, Bn(e, n))
        },
        notes: function (e, n) {
            return _n(e).intervals.map((e => x(n, e)))
        },
        triads: Un($n.map((e => e[4]))),
        seventhChords: Un($n.map((e => e[5]))),
        entries: Rn,
        mode: Fn
    };
    var Kn = {
        fromRomanNumerals: function (e, n) {
            return n.map(Mn).map((n => x(e, j(n)) + n.chordType))
        },
        toRomanNumerals: function (e, n) {
            return n.map((n => {
                const [t, r] = je(n);
                return Mn(j(T(e, t))).name + r
            }))
        }
    };

    function Ln(e) {
        const n = z(e.map(Be));
        return e.length && n.length === e.length ? n.reduce(((e, n) => {
            const t = e[e.length - 1];
            return e.concat(_(t, n).slice(1))
        }), [n[0]]) : []
    }
    var Hn = {
        numeric: Ln,
        chromatic: function (e, n) {
            return Ln(e).map((e => Qe(e, n)))
        }
    };
    const Jn = {
        empty: !0,
        name: "",
        type: "",
        tonic: null,
        setNum: NaN,
        chroma: "",
        normalized: "",
        aliases: [],
        notes: [],
        intervals: []
    };

    function Qn(e) {
        if ("string" != typeof e) return ["", ""];
        const n = e.indexOf(" "),
            t = M(e.substring(0, n));
        if (t.empty) {
            const n = M(e);
            return n.empty ? ["", e] : [n.name, ""]
        }
        const r = e.substring(t.name.length + 1);
        return [t.name, r.length ? r : ""]
    }

    function Wn(e) {
        const n = Array.isArray(e) ? e : Qn(e),
            t = M(n[0]).name,
            r = fe(n[1]);
        if (r.empty) return Jn;
        const o = r.name,
            a = t ? r.intervals.map((e => x(t, e))) : [],
            m = t ? t + " " + o : o;
        return {
            ...r,
            name: m,
            type: o,
            tonic: t,
            notes: a
        }
    }

    function Xn(e) {
        const n = e.map((e => M(e).pc)).filter((e => e)),
            t = n[0],
            r = sn(n);
        return F(r.indexOf(t), r)
    }
    var Yn = {
        get: Wn,
        names: Me,
        extended: function (e) {
            const n = Z(Wn(e).chroma);
            return he().filter((e => n(e.chroma))).map((e => e.name))
        },
        modeNames: function (e) {
            const n = Wn(e);
            if (n.empty) return [];
            const t = n.tonic ? n.notes : n.intervals;
            return X(n.chroma).map(((e, n) => {
                const r = Wn(e).name;
                return r ? [t[n], r] : ["", ""]
            })).filter((e => e[0]))
        },
        reduced: function (e) {
            const n = Y(Wn(e).chroma);
            return he().filter((e => n(e.chroma))).map((e => e.name))
        },
        scaleChords: function (e) {
            const n = Y(Wn(e).chroma);
            return ie().filter((e => n(e.chroma))).map((e => e.aliases[0]))
        },
        scaleNotes: Xn,
        tokenize: Qn,
        rangeOf: function (e) {
            const n = function (e) {
                const n = Array.isArray(e) ? Xn(e) : Wn(e).notes,
                    t = n.map((e => M(e).chroma));
                return e => {
                    const r = M("number" == typeof e ? nn(e) : e),
                        o = r.height;
                    if (void 0 === o) return;
                    const a = o % 12,
                        m = t.indexOf(a);
                    return -1 !== m ? un(r.name, n[m]) : void 0
                }
            }(e);
            return (e, t) => {
                const r = M(e).height,
                    o = M(t).height;
                return void 0 === r || void 0 === o ? [] : _(r, o).map(n).filter((e => e))
            }
        },
        scale: n("Scale.scale", "Scale.get", Wn)
    };
    const Zn = {
            empty: !0,
            name: "",
            upper: void 0,
            lower: void 0,
            type: void 0,
            additive: []
        },
        et = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
    const nt = /^(\d?\d(?:\+\d)*)\/(\d)$/,
        tt = new Map;

    function rt(e) {
        if ("string" == typeof e) {
            const [n, t, r] = nt.exec(e) || [];
            return rt([t, r])
        }
        const [n, t] = e, r = +t;
        if ("number" == typeof n) return [n, r];
        const o = n.split("+").map((e => +e));
        return 1 === o.length ? [o[0], r] : [o, r]
    }
    var ot = {
        names: function () {
            return et.slice()
        },
        parse: rt,
        get: function (e) {
            const n = tt.get(e);
            if (n) return n;
            const t = function ([e, n]) {
                const t = Array.isArray(e) ? e.reduce(((e, n) => e + n), 0) : e,
                    r = n;
                if (0 === t || 0 === r) return Zn;
                const o = Array.isArray(e) ? `${e.join("+")}/${n}` : `${e}/${n}`,
                    a = Array.isArray(e) ? e : [];
                return {
                    empty: !1,
                    name: o,
                    type: 4 === r || 2 === r ? "simple" : 8 === r && t % 3 == 0 ? "compound" : "irregular",
                    upper: t,
                    lower: r,
                    additive: a
                }
            }(rt(e));
            return tt.set(e, t), t
        }
    };
    var at, mt, it = (function (e, n) {
        ! function (e, n, t, r, o, a, m, i, c, s, u, l, d, P, M, f, p, h, y, b) {
            function g(e) {
                return e && "object" == typeof e && "default" in e ? e : {
                    default: e
                }
            }

            function A(e) {
                if (e && e.__esModule) return e;
                var n = Object.create(null);
                return e && Object.keys(e).forEach((function (t) {
                    if ("default" !== t) {
                        var r = Object.getOwnPropertyDescriptor(e, t);
                        Object.defineProperty(n, t, r.get ? r : {
                            enumerable: !0,
                            get: function () {
                                return e[t]
                            }
                        })
                    }
                })), n.default = e, Object.freeze(n)
            }
            var v = g(n),
                j = A(t),
                I = g(r),
                N = g(o),
                O = g(a),
                x = A(m),
                T = g(i),
                w = g(c),
                D = g(s),
                S = g(u),
                C = g(l),
                V = g(d),
                $ = g(P),
                q = g(M),
                k = g(f),
                E = g(p),
                _ = g(h),
                F = g(y),
                z = g(b),
                R = x,
                U = $.default,
                B = N.default,
                G = F.default;
            Object.defineProperty(e, "AbcNotation", {
                enumerable: !0,
                get: function () {
                    return v.default
                }
            }), e.Array = j, Object.defineProperty(e, "Chord", {
                enumerable: !0,
                get: function () {
                    return I.default
                }
            }), Object.defineProperty(e, "ChordType", {
                enumerable: !0,
                get: function () {
                    return N.default
                }
            }), Object.defineProperty(e, "Collection", {
                enumerable: !0,
                get: function () {
                    return O.default
                }
            }), e.Core = x, Object.defineProperty(e, "DurationValue", {
                enumerable: !0,
                get: function () {
                    return T.default
                }
            }), Object.defineProperty(e, "Interval", {
                enumerable: !0,
                get: function () {
                    return w.default
                }
            }), Object.defineProperty(e, "Key", {
                enumerable: !0,
                get: function () {
                    return D.default
                }
            }), Object.defineProperty(e, "Midi", {
                enumerable: !0,
                get: function () {
                    return S.default
                }
            }), Object.defineProperty(e, "Mode", {
                enumerable: !0,
                get: function () {
                    return C.default
                }
            }), Object.defineProperty(e, "Note", {
                enumerable: !0,
                get: function () {
                    return V.default
                }
            }), Object.defineProperty(e, "Pcset", {
                enumerable: !0,
                get: function () {
                    return $.default
                }
            }), Object.defineProperty(e, "Progression", {
                enumerable: !0,
                get: function () {
                    return q.default
                }
            }), Object.defineProperty(e, "Range", {
                enumerable: !0,
                get: function () {
                    return k.default
                }
            }), Object.defineProperty(e, "RomanNumeral", {
                enumerable: !0,
                get: function () {
                    return E.default
                }
            }), Object.defineProperty(e, "Scale", {
                enumerable: !0,
                get: function () {
                    return _.default
                }
            }), Object.defineProperty(e, "ScaleType", {
                enumerable: !0,
                get: function () {
                    return F.default
                }
            }), Object.defineProperty(e, "TimeSignature", {
                enumerable: !0,
                get: function () {
                    return z.default
                }
            }), e.ChordDictionary = B, e.PcSet = U, e.ScaleDictionary = G, e.Tonal = R, Object.keys(m).forEach((function (n) {
                "default" === n || e.hasOwnProperty(n) || Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                        return m[n]
                    }
                })
            })), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }(n, q, E, Oe, ue, R, w, Se, ze, Vn, We, Gn, ln, ne, Kn, Hn, gn, Yn, ge, ot)
    }(at = {
        exports: {}
    }, at.exports), at.exports);
    return (mt = it) && mt.__esModule && Object.prototype.hasOwnProperty.call(mt, "default") ? mt.default : mt
}();
//# sourceMappingURL=tonal.min.js.map
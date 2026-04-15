import { UmbElementMixin as ht } from "@umbraco-cms/backoffice/element-api";
import { UMB_AUTH_CONTEXT as ct } from "@umbraco-cms/backoffice/auth";
const H = globalThis, L = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), G = /* @__PURE__ */ new WeakMap();
let it = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (L && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = G.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const lt = (r) => new it(typeof r == "string" ? r : r + "", void 0, B), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new it(e, r, B);
}, pt = (r, t) => {
  if (L) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = H.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Z = L ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return lt(e);
})(r) : r;
const { is: dt, defineProperty: $t, getOwnPropertyDescriptor: _t, getOwnPropertyNames: yt, getOwnPropertySymbols: ft, getPrototypeOf: mt } = Object, z = globalThis, J = z.trustedTypes, gt = J ? J.emptyScript : "", vt = z.reactiveElementPolyfillSupport, P = (r, t) => r, M = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? gt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, I = (r, t) => !dt(r, t), K = { attribute: !0, type: String, converter: M, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = K) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && $t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = _t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const h = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? K;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...yt(e), ...ft(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Z(i));
    } else t !== void 0 && e.push(Z(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : M).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = s.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : M;
      this._$Em = i;
      const h = n.fromAttribute(e, o.type);
      this[i] = h ?? this._$Ej?.get(i) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? I)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: n } = o, h = this[i];
        n !== !0 || this._$AL.has(i) || h === void 0 || this.C(i, void 0, o, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), vt?.({ ReactiveElement: S }), (z.reactiveElementVersions ??= []).push("2.1.2");
const V = globalThis, F = (r) => r, k = V.trustedTypes, X = k ? k.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, rt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + g, bt = `<${ot}>`, A = document, x = () => A.createComment(""), R = (r) => r === null || typeof r != "object" && typeof r != "function", W = Array.isArray, At = (r) => W(r) || typeof r?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, Y = />/g, v = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tt = /'/g, et = /"/g, nt = /^(?:script|style|textarea|title)$/i, St = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = St(1), E = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function at(r, t) {
  if (!W(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const Et = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = w;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let u, p, c = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, p = n.exec(a), p !== null); ) _ = n.lastIndex, n === w ? p[1] === "!--" ? n = Q : p[1] !== void 0 ? n = Y : p[2] !== void 0 ? (nt.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = i ?? w, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? et : tt) : n === et || n === tt ? n = v : n === Q || n === Y ? n = w : (n = v, i = void 0);
    const f = n === v && r[h + 1].startsWith("/>") ? " " : "";
    o += n === w ? a + bt : c >= 0 ? (s.push(u), a.slice(0, c) + rt + a.slice(c) + g + f) : a + g + (c === -2 ? h : f);
  }
  return [at(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const h = t.length - 1, a = this.parts, [u, p] = Et(t, e);
    if (this.el = U.createElement(u, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = b.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(rt)) {
          const _ = p[n++], f = i.getAttribute(c).split(g), O = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: o, name: O[2], strings: f, ctor: O[1] === "." ? wt : O[1] === "?" ? Pt : O[1] === "@" ? Ct : N }), i.removeAttribute(c);
        } else c.startsWith(g) && (a.push({ type: 6, index: o }), i.removeAttribute(c));
        if (nt.test(i.tagName)) {
          const c = i.textContent.split(g), _ = c.length - 1;
          if (_ > 0) {
            i.textContent = k ? k.emptyScript : "";
            for (let f = 0; f < _; f++) i.append(c[f], x()), b.nextNode(), a.push({ type: 2, index: ++o });
            i.append(c[_], x());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ot) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(g, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += g.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(r, t, e = r, s) {
  if (t === E) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = R(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = T(r, i._$AS(r, t.values), i, s)), t;
}
class Tt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? A).importNode(e, !0);
    b.currentNode = i;
    let o = b.nextNode(), n = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new D(o, o.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (u = new xt(o, this, t)), this._$AV.push(u), a = s[++h];
      }
      n !== a?.index && (o = b.nextNode(), n++);
    }
    return b.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = T(this, t, e), R(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : At(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = U.createElement(at(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const o = new Tt(i, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = st.get(t.strings);
    return e === void 0 && st.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new D(this.O(x()), this.O(x()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = F(t).nextSibling;
      F(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class N {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = T(this, t, e, 0), n = !R(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const h = t;
      let a, u;
      for (t = o[0], a = 0; a < o.length - 1; a++) u = T(this, h[s + a], e, a), u === E && (u = this._$AH[a]), n ||= !R(u) || u !== this._$AH[a], u === l ? t = l : t !== l && (t += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class wt extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Pt extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ct extends N {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? l) === E) return;
    const s = this._$AH, i = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== l && (s === l || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class xt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    T(this, t);
  }
}
const Rt = V.litHtmlPolyfillSupport;
Rt?.(U, D), (V.litHtmlVersions ??= []).push("3.3.2");
const Ut = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = i = new D(t.insertBefore(x(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
const q = globalThis;
class C extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
C._$litElement$ = !0, C.finalized = !0, q.litElementHydrateSupport?.({ LitElement: C });
const Dt = q.litElementPolyfillSupport;
Dt?.({ LitElement: C });
(q.litElementVersions ??= []).push("4.2.2");
const Ot = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
const Ht = { attribute: !0, type: String, converter: M, reflect: !1, hasChanged: I }, Mt = (r = Ht, t, e) => {
  const { kind: s, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(n, a, r, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(n, void 0, r, h), h;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(h) {
      const a = this[n];
      t.call(this, h), this.requestUpdate(n, a, r, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function kt(r) {
  return (t, e) => typeof e == "object" ? Mt(r, t, e) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, t, e);
}
function y(r) {
  return kt({ ...r, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, Nt = Object.getOwnPropertyDescriptor, $ = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Nt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && zt(t, e, i), i;
};
const jt = {
  documentTypes: "Document Types",
  dataTypes: "Data Types",
  thirdPartyDataTypes: "Third Party Data Types",
  umbracoDataTypes: "Umbraco Data Types"
};
let d = class extends ht(C) {
  constructor() {
    super(...arguments), this._isRunning = !1, this._saveResponse = !1, this._hasResults = !1, this._documentTypes = [], this._dataTypes = [], this._thirdPartyDataTypes = [], this._umbracoDataTypes = [], this._counts = { dataTypes: 0, documentTypes: 0, umbracoDataTypes: 0, thirdPartyDataTypes: 0 }, this._openSections = /* @__PURE__ */ new Set();
  }
  async connectedCallback() {
    super.connectedCallback(), this._authContext = await this.getContext(ct), await this._loadSavedValues();
  }
  async _getAuthHeaders() {
    return this._authContext ? { Authorization: `Bearer ${await this._authContext.getLatestToken()}` } : {};
  }
  async _loadSavedValues() {
    const r = await this._getAuthHeaders(), t = await fetch("/umbraco/management/api/v1/decluttertypes/GetSavedValues", { headers: r });
    if (t.ok) {
      const e = await t.json();
      e.isSuccess && this._applyResults(e);
    }
  }
  async _runDeclutter() {
    this._isRunning = !0;
    const r = await this._getAuthHeaders(), t = `/umbraco/management/api/v1/decluttertypes/GetValues?isSaving=${this._saveResponse}`, e = await fetch(t, { headers: r });
    if (e.ok) {
      const s = await e.json();
      s.isSuccess && this._applyResults(s);
    }
    this._isRunning = !1;
  }
  _applyResults(r) {
    this._documentTypes = r.documentTypes, this._dataTypes = r.dataTypes, this._thirdPartyDataTypes = r.thirdPartyDataTypes, this._umbracoDataTypes = r.umbracoDataTypes, this._counts = r.typeUsageResult, this._hasResults = !0;
  }
  _toggleSection(r) {
    const t = new Set(this._openSections);
    t.has(r) ? t.delete(r) : t.add(r), this._openSections = t;
  }
  _getEditUrl(r) {
    return r.type === "documentType" ? `/umbraco/section/settings/workspace/document-type/edit/${r.guid}` : `/umbraco/section/settings/workspace/data-type/edit/${r.guid}`;
  }
  render() {
    return m`
            <uui-box headline="Declutter Types" class="mb-1">
                <div class="intro">
                    <p class="beta-notice">This tool is in Beta. Based on our knowledge of Umbraco and how to find in-use properties and document/data types — if you note a specific type and would like us to investigate, please raise an issue in <a href="https://github.com/SamR-DWL/DigitalWonderlab.DeclutterTypes/issues" target="_blank">GitHub</a>.</p>
                    <p>This tool will scan your <strong>published</strong> content for in-use document types and data types. It will also scan your media content for in-use data types and properties.</p>
                    <p>Running this tool will show a list of data types and document types that it has found not in use. This is not an exhaustive list — some settings or customised views may still be used but marked as unused, so delete with caution.</p>
                    <p>The items will be organised in the manner they are in Umbraco, reflecting the hierarchy and structure of your document and data types. Each item below will contain a link to their place in Umbraco for you to do a final check before deleting.</p>
                    <hr />
                </div>

                <div class="controls">
                    <uui-button
                        look="primary"
                        color="positive"
                        ?disabled=${this._isRunning}
                        @click=${this._runDeclutter}
                    >
                        ${this._isRunning ? m`<uui-loader-circle></uui-loader-circle> Running...` : "Run"}
                    </uui-button>
                    <uui-toggle
                        label="Save in Tool"
                        ?checked=${this._saveResponse}
                        @change=${(r) => this._saveResponse = r.target.checked}
                    >Save in Tool</uui-toggle>
                </div>
            </uui-box>

            ${this._hasResults ? this._renderResults() : l}
        `;
  }
  _renderResults() {
    return m`
            <uui-box class="mb-1">
                <div class="results-summary">
                    <h3>Results</h3>
                    <p>Document Types not used: <strong>${this._counts.documentTypes}</strong></p>
                    <p>Data Types not used: <strong>${this._counts.dataTypes}</strong></p>
                    <p>Third Party Data Types (unknown if used): <strong>${this._counts.thirdPartyDataTypes}</strong></p>
                    <p>Umbraco Types: <strong>${this._counts.umbracoDataTypes}</strong></p>
                </div>
            </uui-box>

            ${this._renderSection("documentTypes", this._documentTypes)}
            ${this._renderSection("dataTypes", this._dataTypes)}
            ${this._renderSection("thirdPartyDataTypes", this._thirdPartyDataTypes)}
            ${this._renderSection("umbracoDataTypes", this._umbracoDataTypes)}
        `;
  }
  _renderSection(r, t) {
    if (!t.length) return l;
    const e = this._openSections.has(r), s = jt[r], i = /* @__PURE__ */ new Map();
    for (const o of t) {
      const n = o.path.length >= 2 ? o.path[o.path.length - 2] ?? "Root" : "Root";
      i.has(n) || i.set(n, []), i.get(n).push(o);
    }
    return m`
            <uui-box class="mb-1">
                <div class="section-header" @click=${() => this._toggleSection(r)}>
                    <span class="chevron ${e ? "open" : ""}">›</span>
                    <h3>${s}</h3>
                </div>
                ${e ? m`
                    <div class="section-body">
                        ${r === "thirdPartyDataTypes" ? m`
                            <p class="caveat">While this tool has verified whether the property has a value, we cannot be sure if the lack of a value is intentional. Treat these entries with care.</p>
                        ` : l}
                        ${[...i.entries()].map(([o, n]) => m`
                            <div class="group">
                                <div class="group-label">${o}</div>
                                ${n.map((h) => m`
                                    <div class="item-card">
                                        <strong>${h.name}</strong>
                                        <span class="item-id">ID: ${h.id}</span>
                                        <a href="${this._getEditUrl(h)}" target="_blank">Open in Umbraco</a>
                                    </div>
                                `)}
                            </div>
                        `)}
                    </div>
                ` : l}
            </uui-box>
        `;
  }
};
d.styles = ut`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }

        .intro p {
            margin: var(--uui-size-space-3) 0;
        }

        .mb-1{
            margin-bottom:var(--uui-size-space-4);
        }

        .beta-notice {
            padding: var(--uui-size-space-3);
            background: var(--uui-color-warning-emphasis);
            border-radius: var(--uui-border-radius);
        }

        .controls {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
            margin-top: var(--uui-size-space-4);
        }

        .results-summary p {
            margin: var(--uui-size-space-2) 0;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            cursor: pointer;
            user-select: none;
        }

        .section-header h3 {
            margin: 0;
        }

        .chevron {
            font-size: 1.2em;
            transition: transform 0.2s;
            display: inline-block;
        }

        .chevron.open {
            transform: rotate(90deg);
        }

        .section-body {
            margin-top: var(--uui-size-space-3);
        }

        .caveat {
            font-style: italic;
            color: var(--uui-color-text-alt);
            margin-bottom: var(--uui-size-space-3);
        }

        .group {
            margin-bottom: var(--uui-size-space-4);
        }

        .group-label {
            font-weight: bold;
            padding: var(--uui-size-space-2) 0;
            border-bottom: 1px solid var(--uui-color-border);
            margin-bottom: var(--uui-size-space-2);
        }

        .item-card {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
            padding: var(--uui-size-space-2) var(--uui-size-space-3);
            border-radius: var(--uui-border-radius);
            margin-bottom: var(--uui-size-space-1);
        }

        .item-card:hover {
            background: var(--uui-color-surface-emphasis);
        }

        .item-id {
            color: var(--uui-color-text-alt);
            font-size: 0.85em;
        }

        .item-card a {
            margin-left: auto;
            color: var(--uui-color-interactive);
        }
    `;
$([
  y()
], d.prototype, "_isRunning", 2);
$([
  y()
], d.prototype, "_saveResponse", 2);
$([
  y()
], d.prototype, "_hasResults", 2);
$([
  y()
], d.prototype, "_documentTypes", 2);
$([
  y()
], d.prototype, "_dataTypes", 2);
$([
  y()
], d.prototype, "_thirdPartyDataTypes", 2);
$([
  y()
], d.prototype, "_umbracoDataTypes", 2);
$([
  y()
], d.prototype, "_counts", 2);
$([
  y()
], d.prototype, "_openSections", 2);
d = $([
  Ot("declutter-types-element")
], d);
export {
  d as DeclutterTypesElement
};
//# sourceMappingURL=declutter-types.js.map

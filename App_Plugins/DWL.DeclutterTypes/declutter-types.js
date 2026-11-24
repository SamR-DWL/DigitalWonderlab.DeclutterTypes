import { UmbElementMixin as ht } from "@umbraco-cms/backoffice/element-api";
import { UMB_AUTH_CONTEXT as lt } from "@umbraco-cms/backoffice/auth";
const k = globalThis, L = k.ShadowRoot && (k.ShadyCSS === void 0 || k.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), G = /* @__PURE__ */ new WeakMap();
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
const ct = (n) => new it(typeof n == "string" ? n : n + "", void 0, B), ut = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new it(e, n, B);
}, pt = (n, t) => {
  if (L) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = k.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, Z = L ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ct(e);
})(n) : n;
const { is: dt, defineProperty: $t, getOwnPropertyDescriptor: _t, getOwnPropertyNames: yt, getOwnPropertySymbols: mt, getPrototypeOf: ft } = Object, z = globalThis, J = z.trustedTypes, gt = J ? J.emptyScript : "", vt = z.reactiveElementPolyfillSupport, P = (n, t) => n, H = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? gt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, I = (n, t) => !dt(n, t), K = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
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
    const { get: i, set: r } = _t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const h = i?.call(this);
      r?.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? K;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = ft(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...yt(e), ...mt(e)];
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
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : H;
      this._$Em = i;
      const h = o.fromAttribute(e, r.type);
      this[i] = h ?? this._$Ej?.get(i) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (r = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? I)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: o } = r, h = this[i];
        o !== !0 || this._$AL.has(i) || h === void 0 || this.C(i, void 0, r, h);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[P("elementProperties")] = /* @__PURE__ */ new Map(), T[P("finalized")] = /* @__PURE__ */ new Map(), vt?.({ ReactiveElement: T }), (z.reactiveElementVersions ??= []).push("2.1.2");
const V = globalThis, F = (n) => n, M = V.trustedTypes, X = M ? M.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, nt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, rt = "?" + g, bt = `<${rt}>`, A = document, C = () => A.createComment(""), U = (n) => n === null || typeof n != "object" && typeof n != "function", W = Array.isArray, At = (n) => W(n) || typeof n?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, Y = />/g, v = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tt = /'/g, et = /"/g, ot = /^(?:script|style|textarea|title)$/i, Tt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), _ = Tt(1), S = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function at(n, t) {
  if (!W(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const St = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
  for (let h = 0; h < e; h++) {
    const a = n[h];
    let u, p, l = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, p = o.exec(a), p !== null); ) m = o.lastIndex, o === w ? p[1] === "!--" ? o = Q : p[1] !== void 0 ? o = Y : p[2] !== void 0 ? (ot.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = v) : p[3] !== void 0 && (o = v) : o === v ? p[0] === ">" ? (o = i ?? w, l = -1) : p[1] === void 0 ? l = -2 : (l = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? v : p[3] === '"' ? et : tt) : o === et || o === tt ? o = v : o === Q || o === Y ? o = w : (o = v, i = void 0);
    const f = o === v && n[h + 1].startsWith("/>") ? " " : "";
    r += o === w ? a + bt : l >= 0 ? (s.push(u), a.slice(0, l) + nt + a.slice(l) + g + f) : a + g + (l === -2 ? h : f);
  }
  return [at(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const h = t.length - 1, a = this.parts, [u, p] = St(t, e);
    if (this.el = O.createElement(u, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = b.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(nt)) {
          const m = p[o++], f = i.getAttribute(l).split(g), D = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: D[2], strings: f, ctor: D[1] === "." ? wt : D[1] === "?" ? Pt : D[1] === "@" ? xt : N }), i.removeAttribute(l);
        } else l.startsWith(g) && (a.push({ type: 6, index: r }), i.removeAttribute(l));
        if (ot.test(i.tagName)) {
          const l = i.textContent.split(g), m = l.length - 1;
          if (m > 0) {
            i.textContent = M ? M.emptyScript : "";
            for (let f = 0; f < m; f++) i.append(l[f], C()), b.nextNode(), a.push({ type: 2, index: ++r });
            i.append(l[m], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === rt) a.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(g, l + 1)) !== -1; ) a.push({ type: 7, index: r }), l += g.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(n, t, e = n, s) {
  if (t === S) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = U(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = E(n, i._$AS(n, t.values), i, s)), t;
}
class Et {
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
    let r = b.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new R(r, r.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (u = new Ct(r, this, t)), this._$AV.push(u), a = s[++h];
      }
      o !== a?.index && (r = b.nextNode(), o++);
    }
    return b.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = E(this, t, e), U(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : At(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(at(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new Et(i, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = st.get(t.strings);
    return e === void 0 && st.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new R(this.O(C()), this.O(C()), this, this.options)) : s = e[i], s._$AI(r), i++;
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
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = E(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const h = t;
      let a, u;
      for (t = r[0], a = 0; a < r.length - 1; a++) u = E(this, h[s + a], e, a), u === S && (u = this._$AH[a]), o ||= !U(u) || u !== this._$AH[a], u === c ? t = c : t !== c && (t += (u ?? "") + r[a + 1]), this._$AH[a] = u;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class wt extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Pt extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class xt extends N {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? c) === S) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ct {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Ut = V.litHtmlPolyfillSupport;
Ut?.(O, R), (V.litHtmlVersions ??= []).push("3.3.2");
const Ot = (n, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = i = new R(t.insertBefore(C(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
const q = globalThis;
class x extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
x._$litElement$ = !0, x.finalized = !0, q.litElementHydrateSupport?.({ LitElement: x });
const Rt = q.litElementPolyfillSupport;
Rt?.({ LitElement: x });
(q.litElementVersions ??= []).push("4.2.2");
const Dt = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
const kt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: I }, Ht = (n = kt, t, e) => {
  const { kind: s, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, n, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, n, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, n, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Mt(n) {
  return (t, e) => typeof e == "object" ? Ht(n, t, e) : ((s, i, r) => {
    const o = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(n, t, e);
}
function y(n) {
  return Mt({ ...n, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, Nt = Object.getOwnPropertyDescriptor, $ = (n, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Nt(t, e) : t, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && zt(t, e, i), i;
};
const jt = {
  documentTypes: "Document Types",
  dataTypes: "Data Types",
  thirdPartyDataTypes: "Third Party Data Types",
  umbracoDataTypes: "Umbraco Data Types",
  unpublishedOnlyTypes: "Used Only in Unpublished Content"
};
let d = class extends ht(x) {
  constructor() {
    super(...arguments), this._isRunning = !1, this._saveResponse = !1, this._hasResults = !1, this._documentTypes = [], this._dataTypes = [], this._thirdPartyDataTypes = [], this._umbracoDataTypes = [], this._unpublishedOnlyTypes = [], this._counts = { dataTypes: 0, documentTypes: 0, umbracoDataTypes: 0, thirdPartyDataTypes: 0 }, this._openSections = /* @__PURE__ */ new Set();
  }
  async connectedCallback() {
    super.connectedCallback(), this._authContext = await this.getContext(lt), await this._loadSavedValues();
  }
  async _getAuthHeaders() {
    return this._authContext ? { Authorization: `Bearer ${await this._authContext.getLatestToken()}` } : {};
  }
  async _loadSavedValues() {
    const n = await this._getAuthHeaders(), t = await fetch("/umbraco/management/api/v1/decluttertypes/GetSavedValues", { headers: n });
    if (t.ok) {
      const e = await t.json();
      e.isSuccess && this._applyResults(e);
    }
  }
  async _runDeclutter() {
    this._isRunning = !0;
    const n = await this._getAuthHeaders(), t = `/umbraco/management/api/v1/decluttertypes/GetValues?isSaving=${this._saveResponse}`, e = await fetch(t, { headers: n });
    if (e.ok) {
      const s = await e.json();
      s.isSuccess && this._applyResults(s);
    }
    this._isRunning = !1;
  }
  _applyResults(n) {
    this._documentTypes = n.documentTypes, this._dataTypes = n.dataTypes, this._thirdPartyDataTypes = n.thirdPartyDataTypes, this._umbracoDataTypes = n.umbracoDataTypes, this._unpublishedOnlyTypes = n.unpublishedOnlyTypes ?? [], this._counts = n.typeUsageResult, this._hasResults = !0;
  }
  _toggleSection(n) {
    const t = new Set(this._openSections);
    t.has(n) ? t.delete(n) : t.add(n), this._openSections = t;
  }
  _getEditUrl(n) {
    return n.type === "documentType" ? `/umbraco/section/settings/workspace/document-type/edit/${n.guid}` : `/umbraco/section/settings/workspace/data-type/edit/${n.guid}`;
  }
  render() {
    return _`
            <uui-box headline="Declutter Types" class="mb-1">
                <div class="intro">
                    <p class="beta-notice">This tool is in Beta. Based on our knowledge of Umbraco and how to find in-use properties and document/data types — if you note a specific type and would like us to investigate, please raise an issue in <a href="https://github.com/SamR-DWL/DigitalWonderlab.DeclutterTypes/issues" target="_blank">GitHub</a>.</p>
                    <p>This tool scans all of your content, media and members for in-use document types and data types. That includes unpublished content and unpublished changes, and blocks wherever they are stored: Block List, Block Grid, blocks in a rich text editor, nested blocks and Nested Content.</p>
                    <p>Types that are only used by unpublished content or unpublished changes are listed separately, as deleting them would delete or break that content.</p>
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
                        ${this._isRunning ? _`<uui-loader-circle></uui-loader-circle> Running...` : "Run"}
                    </uui-button>
                    <uui-toggle
                        label="Save in Tool"
                        ?checked=${this._saveResponse}
                        @change=${(n) => this._saveResponse = n.target.checked}
                    >Save in Tool</uui-toggle>
                </div>
            </uui-box>

            ${this._hasResults ? this._renderResults() : c}
        `;
  }
  _renderResults() {
    return _`
            <uui-box class="mb-1">
                <div class="results-summary">
                    <h3>Results</h3>
                    <p>Document Types not used: <strong>${this._counts.documentTypes}</strong></p>
                    <p>Data Types not used: <strong>${this._counts.dataTypes}</strong></p>
                    <p>Third Party Data Types (unknown if used): <strong>${this._counts.thirdPartyDataTypes}</strong></p>
                    <p>Umbraco Types: <strong>${this._counts.umbracoDataTypes}</strong></p>
                    <p>Used only in unpublished content: <strong>${this._counts.unpublishedOnlyTypes ?? 0}</strong></p>
                </div>
            </uui-box>

            ${this._renderSection("documentTypes", this._documentTypes)}
            ${this._renderSection("dataTypes", this._dataTypes)}
            ${this._renderSection("thirdPartyDataTypes", this._thirdPartyDataTypes)}
            ${this._renderSection("umbracoDataTypes", this._umbracoDataTypes)}
            ${this._renderSection("unpublishedOnlyTypes", this._unpublishedOnlyTypes)}
        `;
  }
  _renderSection(n, t) {
    if (!t.length) return c;
    const e = this._openSections.has(n), s = jt[n], i = /* @__PURE__ */ new Map();
    for (const r of t) {
      const o = r.path.length >= 2 ? r.path[r.path.length - 2] ?? "Root" : "Root";
      i.has(o) || i.set(o, []), i.get(o).push(r);
    }
    return _`
            <uui-box class="mb-1">
                <div class="section-header" @click=${() => this._toggleSection(n)}>
                    <span class="chevron ${e ? "open" : ""}">›</span>
                    <h3>${s}</h3>
                </div>
                ${e ? _`
                    <div class="section-body">
                        ${n === "thirdPartyDataTypes" ? _`
                            <p class="caveat">While this tool has verified whether the property has a value, we cannot be sure if the lack of a value is intentional. Treat these entries with care.</p>
                        ` : c}
                        ${n === "unpublishedOnlyTypes" ? _`
                            <p class="caveat">These are in use, but only by unpublished content or unpublished changes. Deleting them would delete or break that content.</p>
                        ` : c}
                        ${[...i.entries()].map(([r, o]) => _`
                            <div class="group">
                                <div class="group-label">${r}</div>
                                ${o.map((h) => _`
                                    <div class="item-card">
                                        <div class="item-text">
                                            <strong>${h.name}</strong>
                                            ${h.detail ? _`<span class="item-detail">${h.detail}</span>` : c}
                                        </div>
                                        <span class="item-id">ID: ${h.id}</span>
                                        <a href="${this._getEditUrl(h)}" target="_blank">Open in Umbraco</a>
                                    </div>
                                `)}
                            </div>
                        `)}
                    </div>
                ` : c}
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

        .item-text {
            display: flex;
            flex-direction: column;
            gap: var(--uui-size-space-1);
        }

        .item-detail {
            color: var(--uui-color-text-alt);
            font-size: 0.85em;
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
], d.prototype, "_unpublishedOnlyTypes", 2);
$([
  y()
], d.prototype, "_counts", 2);
$([
  y()
], d.prototype, "_openSections", 2);
d = $([
  Dt("declutter-types-element")
], d);
export {
  d as DeclutterTypesElement
};
//# sourceMappingURL=declutter-types.js.map

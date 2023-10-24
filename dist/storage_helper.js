import vt from "node:path";
import S from "node:fs";
import { promisify as A } from "node:util";
import de from "node:process";
import Et from "node:os";
const Ae = {}, ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ae
}, Symbol.toStringTag, { value: "Module" })), z = (e, t) => function(...r) {
  return e.apply(void 0, r).catch(t);
}, V = (e, t) => function(...r) {
  try {
    return e.apply(void 0, r);
  } catch (i) {
    return t(i);
  }
}, yn = de.getuid ? !de.getuid() : !1, mn = 1e4, G = () => {
}, k = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!k.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !yn && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!k.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!k.isNodeError(e))
      throw e;
    if (!k.isChangeErrorOk(e))
      throw e;
  }
};
class dn {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = mn, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (t) => {
      this.queueWaiting.add(t), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (t) => {
      this.queueWaiting.delete(t), this.queueActive.delete(t);
    }, this.schedule = () => new Promise((t) => {
      const n = () => this.remove(r), r = () => t(n);
      this.add(r);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const t of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(t), this.queueActive.add(t), t();
        }
      }
    };
  }
}
const hn = new dn(), Q = (e, t) => function(r) {
  return function i(...o) {
    return hn.schedule().then((c) => {
      const u = (m) => (c(), m), a = (m) => {
        if (c(), Date.now() >= r)
          throw m;
        if (t(m)) {
          const s = Math.round(100 * Math.random());
          return new Promise((y) => setTimeout(y, s)).then(() => i.apply(void 0, o));
        }
        throw m;
      };
      return e.apply(void 0, o).then(u, a);
    });
  };
}, H = (e, t) => function(r) {
  return function i(...o) {
    try {
      return e.apply(void 0, o);
    } catch (c) {
      if (Date.now() > r)
        throw c;
      if (t(c))
        return i.apply(void 0, o);
      throw c;
    }
  };
}, x = {
  attempt: {
    /* ASYNC */
    chmod: z(A(S.chmod), k.onChangeError),
    chown: z(A(S.chown), k.onChangeError),
    close: z(A(S.close), G),
    fsync: z(A(S.fsync), G),
    mkdir: z(A(S.mkdir), G),
    realpath: z(A(S.realpath), G),
    stat: z(A(S.stat), G),
    unlink: z(A(S.unlink), G),
    /* SYNC */
    chmodSync: V(S.chmodSync, k.onChangeError),
    chownSync: V(S.chownSync, k.onChangeError),
    closeSync: V(S.closeSync, G),
    existsSync: V(S.existsSync, G),
    fsyncSync: V(S.fsync, G),
    mkdirSync: V(S.mkdirSync, G),
    realpathSync: V(S.realpathSync, G),
    statSync: V(S.statSync, G),
    unlinkSync: V(S.unlinkSync, G)
  },
  retry: {
    /* ASYNC */
    close: Q(A(S.close), k.isRetriableError),
    fsync: Q(A(S.fsync), k.isRetriableError),
    open: Q(A(S.open), k.isRetriableError),
    readFile: Q(A(S.readFile), k.isRetriableError),
    rename: Q(A(S.rename), k.isRetriableError),
    stat: Q(A(S.stat), k.isRetriableError),
    write: Q(A(S.write), k.isRetriableError),
    writeFile: Q(A(S.writeFile), k.isRetriableError),
    /* SYNC */
    closeSync: H(S.closeSync, k.isRetriableError),
    fsyncSync: H(S.fsyncSync, k.isRetriableError),
    openSync: H(S.openSync, k.isRetriableError),
    readFileSync: H(S.readFileSync, k.isRetriableError),
    renameSync: H(S.renameSync, k.isRetriableError),
    statSync: H(S.statSync, k.isRetriableError),
    writeSync: H(S.writeSync, k.isRetriableError),
    writeFileSync: H(S.writeFileSync, k.isRetriableError)
  }
}, Sn = "utf8", tt = 438, pn = 511, wn = {}, $t = {}, vn = Et.userInfo().uid, En = Et.userInfo().gid, gt = 7500, $n = !!de.getuid;
de.getuid && de.getuid();
const nt = 128, gn = (e) => e instanceof Error && "code" in e, kn = (e) => typeof e == "function", be = (e) => typeof e == "string", Ie = (e) => e === void 0, Ee = {}, je = {
  /* API */
  next: (e) => {
    const t = Ee[e];
    if (!t)
      return;
    t.shift();
    const n = t[0];
    n ? n(() => je.next(e)) : delete Ee[e];
  },
  schedule: (e) => new Promise((t) => {
    let n = Ee[e];
    n || (n = Ee[e] = []), n.push(t), !(n.length > 1) && t(() => je.next(e));
  })
};
class Fn {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exit = () => {
      for (const t of this.callbacks)
        t();
    }, this.hook = () => {
      window.addEventListener("beforeunload", this.exit);
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const _n = new Fn(), On = _n.register, b = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, n = !0) => {
    const r = b.truncate(t(e));
    return r in b.store ? b.get(e, t, n) : (b.store[r] = n, [r, () => delete b.store[r]]);
  },
  purge: (e) => {
    b.store[e] && (delete b.store[e], x.attempt.unlink(e));
  },
  purgeSync: (e) => {
    b.store[e] && (delete b.store[e], x.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in b.store)
      b.purgeSync(e);
  },
  truncate: (e) => {
    const t = vt.basename(e);
    if (t.length <= nt)
      return e;
    const n = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!n)
      return e;
    const r = t.length - nt;
    return `${e.slice(0, -t.length)}${n[1]}${n[2].slice(0, -r)}${n[3]}`;
  }
};
On(b.purgeSyncAll);
function Me(e, t = wn) {
  if (be(t))
    return Me(e, { encoding: t });
  const n = Date.now() + ((t.timeout ?? gt) || -1);
  return x.retry.readFile(n)(e, t);
}
function kt(e, t, n, r) {
  if (kn(n))
    return kt(e, t, $t, n);
  const i = Ft(e, t, n);
  return r && i.then(r, r), i;
}
async function Ft(e, t, n = $t) {
  if (be(n))
    return Ft(e, t, { encoding: n });
  const r = Date.now() + ((n.timeout ?? gt) || -1);
  let i = null, o = null, c = null, u = null, a = null;
  try {
    n.schedule && (i = await n.schedule(e)), o = await je.schedule(e);
    const m = await x.attempt.realpath(e), s = !!m;
    e = m || e, [u, c] = b.get(e, n.tmpCreate || b.create, n.tmpPurge !== !1);
    const l = $n && Ie(n.chown), y = Ie(n.mode);
    if (s && (l || y)) {
      const f = await x.attempt.stat(e);
      f && (n = { ...n }, l && (n.chown = { uid: f.uid, gid: f.gid }), y && (n.mode = f.mode));
    }
    if (!s) {
      const f = vt.dirname(e);
      await x.attempt.mkdir(f, {
        mode: pn,
        recursive: !0
      });
    }
    a = await x.retry.open(r)(u, "w", n.mode || tt), n.tmpCreated && n.tmpCreated(u), be(t) ? await x.retry.write(r)(a, t, 0, n.encoding || Sn) : Ie(t) || await x.retry.write(r)(a, t, 0, t.length, 0), n.fsync !== !1 && (n.fsyncWait !== !1 ? await x.retry.fsync(r)(a) : x.attempt.fsync(a)), await x.retry.close(r)(a), a = null, n.chown && (n.chown.uid !== vn || n.chown.gid !== En) && await x.attempt.chown(u, n.chown.uid, n.chown.gid), n.mode && n.mode !== tt && await x.attempt.chmod(u, n.mode);
    try {
      await x.retry.rename(r)(u, e);
    } catch (f) {
      if (!gn(f) || f.code !== "ENAMETOOLONG")
        throw f;
      await x.retry.rename(r)(u, b.truncate(e));
    }
    c(), u = null;
  } finally {
    a && await x.attempt.close(a), u && b.purge(u), i && i(), o && o();
  }
}
var We = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Dn(e) {
  if (e.__esModule)
    return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      if (this instanceof r) {
        var i = [null];
        i.push.apply(i, arguments);
        var o = Function.bind.apply(t, i);
        return new o();
      }
      return t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var re = {}, J = {};
J.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function")
      e.apply(this, t);
    else
      return new Promise((n, r) => {
        e.call(
          this,
          ...t,
          (i, o) => i != null ? r(i) : n(o)
        );
      });
  }, "name", { value: e.name });
};
J.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function")
      return e.apply(this, t);
    e.apply(this, t.slice(0, -1)).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
const P = /* @__PURE__ */ Dn(ln);
var X = P, Pn = process.cwd, Fe = null, Nn = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Fe || (Fe = Pn.call(process)), Fe;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var rt = process.chdir;
  process.chdir = function(e) {
    Fe = null, rt.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, rt);
}
var Cn = In;
function In(e) {
  X.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = u(e.stat), e.fstat = u(e.fstat), e.lstat = u(e.lstat), e.statSync = a(e.statSync), e.fstatSync = a(e.fstatSync), e.lstatSync = a(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(s, l, y) {
    y && process.nextTick(y);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(s, l, y, f) {
    f && process.nextTick(f);
  }, e.lchownSync = function() {
  }), Nn === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(s) {
    function l(y, f, d) {
      var $ = Date.now(), v = 0;
      s(y, f, function F(B) {
        if (B && (B.code === "EACCES" || B.code === "EPERM") && Date.now() - $ < 6e4) {
          setTimeout(function() {
            e.stat(f, function(j, fe) {
              j && j.code === "ENOENT" ? s(y, f, F) : d(B);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        d && d(B);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(l, s), l;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(s) {
    function l(y, f, d, $, v, F) {
      var B;
      if (F && typeof F == "function") {
        var j = 0;
        B = function(fe, Ze, et) {
          if (fe && fe.code === "EAGAIN" && j < 10)
            return j++, s.call(e, y, f, d, $, v, B);
          F.apply(this, arguments);
        };
      }
      return s.call(e, y, f, d, $, v, B);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(l, s), l;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : function(s) {
    return function(l, y, f, d, $) {
      for (var v = 0; ; )
        try {
          return s.call(e, l, y, f, d, $);
        } catch (F) {
          if (F.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw F;
        }
    };
  }(e.readSync);
  function t(s) {
    s.lchmod = function(l, y, f) {
      s.open(
        l,
        X.O_WRONLY | X.O_SYMLINK,
        y,
        function(d, $) {
          if (d) {
            f && f(d);
            return;
          }
          s.fchmod($, y, function(v) {
            s.close($, function(F) {
              f && f(v || F);
            });
          });
        }
      );
    }, s.lchmodSync = function(l, y) {
      var f = s.openSync(l, X.O_WRONLY | X.O_SYMLINK, y), d = !0, $;
      try {
        $ = s.fchmodSync(f, y), d = !1;
      } finally {
        if (d)
          try {
            s.closeSync(f);
          } catch {
          }
        else
          s.closeSync(f);
      }
      return $;
    };
  }
  function n(s) {
    X.hasOwnProperty("O_SYMLINK") && s.futimes ? (s.lutimes = function(l, y, f, d) {
      s.open(l, X.O_SYMLINK, function($, v) {
        if ($) {
          d && d($);
          return;
        }
        s.futimes(v, y, f, function(F) {
          s.close(v, function(B) {
            d && d(F || B);
          });
        });
      });
    }, s.lutimesSync = function(l, y, f) {
      var d = s.openSync(l, X.O_SYMLINK), $, v = !0;
      try {
        $ = s.futimesSync(d, y, f), v = !1;
      } finally {
        if (v)
          try {
            s.closeSync(d);
          } catch {
          }
        else
          s.closeSync(d);
      }
      return $;
    }) : s.futimes && (s.lutimes = function(l, y, f, d) {
      d && process.nextTick(d);
    }, s.lutimesSync = function() {
    });
  }
  function r(s) {
    return s && function(l, y, f) {
      return s.call(e, l, y, function(d) {
        m(d) && (d = null), f && f.apply(this, arguments);
      });
    };
  }
  function i(s) {
    return s && function(l, y) {
      try {
        return s.call(e, l, y);
      } catch (f) {
        if (!m(f))
          throw f;
      }
    };
  }
  function o(s) {
    return s && function(l, y, f, d) {
      return s.call(e, l, y, f, function($) {
        m($) && ($ = null), d && d.apply(this, arguments);
      });
    };
  }
  function c(s) {
    return s && function(l, y, f) {
      try {
        return s.call(e, l, y, f);
      } catch (d) {
        if (!m(d))
          throw d;
      }
    };
  }
  function u(s) {
    return s && function(l, y, f) {
      typeof y == "function" && (f = y, y = null);
      function d($, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), f && f.apply(this, arguments);
      }
      return y ? s.call(e, l, y, d) : s.call(e, l, d);
    };
  }
  function a(s) {
    return s && function(l, y) {
      var f = y ? s.call(e, l, y) : s.call(e, l);
      return f && (f.uid < 0 && (f.uid += 4294967296), f.gid < 0 && (f.gid += 4294967296)), f;
    };
  }
  function m(s) {
    if (!s || s.code === "ENOSYS")
      return !0;
    var l = !process.getuid || process.getuid() !== 0;
    return !!(l && (s.code === "EINVAL" || s.code === "EPERM"));
  }
}
var it = P.Stream, Tn = Ln;
function Ln(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t))
      return new t(r, i);
    it.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var c = Object.keys(i), u = 0, a = c.length; u < a; u++) {
      var m = c[u];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(s, l) {
      if (s) {
        o.emit("error", s), o.readable = !1;
        return;
      }
      o.fd = l, o.emit("open", l), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n))
      return new n(r, i);
    it.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), c = 0, u = o.length; c < u; c++) {
      var a = o[c];
      this[a] = i[a];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var xn = An, Rn = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function An(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Rn(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var O = P, bn = Cn, jn = Tn, Mn = xn, $e = P, R, _e;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (R = Symbol.for("graceful-fs.queue"), _e = Symbol.for("graceful-fs.previous")) : (R = "___graceful-fs.queue", _e = "___graceful-fs.previous");
function Wn() {
}
function _t(e, t) {
  Object.defineProperty(e, R, {
    get: function() {
      return t;
    }
  });
}
var ne = Wn;
$e.debuglog ? ne = $e.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (ne = function() {
  var e = $e.format.apply($e, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!O[R]) {
  var Jn = We[R] || [];
  _t(O, Jn), O.close = function(e) {
    function t(n, r) {
      return e.call(O, n, function(i) {
        i || ot(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, _e, {
      value: e
    }), t;
  }(O.close), O.closeSync = function(e) {
    function t(n) {
      e.apply(O, arguments), ot();
    }
    return Object.defineProperty(t, _e, {
      value: e
    }), t;
  }(O.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    ne(O[R]), P.equal(O[R].length, 0);
  });
}
We[R] || _t(We, O[R]);
var q = Ge(Mn(O));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !O.__patched && (q = Ge(O), O.__patched = !0);
function Ge(e) {
  bn(e), e.gracefulify = Ge, e.createReadStream = Ze, e.createWriteStream = et;
  var t = e.readFile;
  e.readFile = n;
  function n(h, w, p) {
    return typeof w == "function" && (p = w, w = null), I(h, w, p);
    function I(T, N, _, D) {
      return t(T, N, function(E) {
        E && (E.code === "EMFILE" || E.code === "ENFILE") ? oe([I, [T, N, _], E, D || Date.now(), Date.now()]) : typeof _ == "function" && _.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(h, w, p, I) {
    return typeof p == "function" && (I = p, p = null), T(h, w, p, I);
    function T(N, _, D, E, L) {
      return r(N, _, D, function(g) {
        g && (g.code === "EMFILE" || g.code === "ENFILE") ? oe([T, [N, _, D, E], g, L || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = c);
  function c(h, w, p, I) {
    return typeof p == "function" && (I = p, p = null), T(h, w, p, I);
    function T(N, _, D, E, L) {
      return o(N, _, D, function(g) {
        g && (g.code === "EMFILE" || g.code === "ENFILE") ? oe([T, [N, _, D, E], g, L || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
      });
    }
  }
  var u = e.copyFile;
  u && (e.copyFile = a);
  function a(h, w, p, I) {
    return typeof p == "function" && (I = p, p = 0), T(h, w, p, I);
    function T(N, _, D, E, L) {
      return u(N, _, D, function(g) {
        g && (g.code === "EMFILE" || g.code === "ENFILE") ? oe([T, [N, _, D, E], g, L || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = l;
  var s = /^v[0-5]\./;
  function l(h, w, p) {
    typeof w == "function" && (p = w, w = null);
    var I = s.test(process.version) ? function(_, D, E, L) {
      return m(_, T(
        _,
        D,
        E,
        L
      ));
    } : function(_, D, E, L) {
      return m(_, D, T(
        _,
        D,
        E,
        L
      ));
    };
    return I(h, w, p);
    function T(N, _, D, E) {
      return function(L, g) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? oe([
          I,
          [N, _, D],
          L,
          E || Date.now(),
          Date.now()
        ]) : (g && g.sort && g.sort(), typeof D == "function" && D.call(this, L, g));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var y = jn(e);
    F = y.ReadStream, j = y.WriteStream;
  }
  var f = e.ReadStream;
  f && (F.prototype = Object.create(f.prototype), F.prototype.open = B);
  var d = e.WriteStream;
  d && (j.prototype = Object.create(d.prototype), j.prototype.open = fe), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return F;
    },
    set: function(h) {
      F = h;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return j;
    },
    set: function(h) {
      j = h;
    },
    enumerable: !0,
    configurable: !0
  });
  var $ = F;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return $;
    },
    set: function(h) {
      $ = h;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = j;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(h) {
      v = h;
    },
    enumerable: !0,
    configurable: !0
  });
  function F(h, w) {
    return this instanceof F ? (f.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments);
  }
  function B() {
    var h = this;
    Ce(h.path, h.flags, h.mode, function(w, p) {
      w ? (h.autoClose && h.destroy(), h.emit("error", w)) : (h.fd = p, h.emit("open", p), h.read());
    });
  }
  function j(h, w) {
    return this instanceof j ? (d.apply(this, arguments), this) : j.apply(Object.create(j.prototype), arguments);
  }
  function fe() {
    var h = this;
    Ce(h.path, h.flags, h.mode, function(w, p) {
      w ? (h.destroy(), h.emit("error", w)) : (h.fd = p, h.emit("open", p));
    });
  }
  function Ze(h, w) {
    return new e.ReadStream(h, w);
  }
  function et(h, w) {
    return new e.WriteStream(h, w);
  }
  var fn = e.open;
  e.open = Ce;
  function Ce(h, w, p, I) {
    return typeof p == "function" && (I = p, p = null), T(h, w, p, I);
    function T(N, _, D, E, L) {
      return fn(N, _, D, function(g, to) {
        g && (g.code === "EMFILE" || g.code === "ENFILE") ? oe([T, [N, _, D, E], g, L || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
      });
    }
  }
  return e;
}
function oe(e) {
  ne("ENQUEUE", e[0].name, e[1]), O[R].push(e), Ye();
}
var ge;
function ot() {
  for (var e = Date.now(), t = 0; t < O[R].length; ++t)
    O[R][t].length > 2 && (O[R][t][3] = e, O[R][t][4] = e);
  Ye();
}
function Ye() {
  if (clearTimeout(ge), ge = void 0, O[R].length !== 0) {
    var e = O[R].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      ne("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      ne("TIMEOUT", t.name, n);
      var c = n.pop();
      typeof c == "function" && c.call(null, r);
    } else {
      var u = Date.now() - o, a = Math.max(o - i, 1), m = Math.min(a * 1.2, 100);
      u >= m ? (ne("RETRY", t.name, n), t.apply(null, n.concat([i]))) : O[R].push(e);
    }
    ge === void 0 && (ge = setTimeout(Ye, 0));
  }
}
(function(e) {
  const t = J.fromCallback, n = q, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((c) => n.exists(i, c));
  }, e.read = function(i, o, c, u, a, m) {
    return typeof m == "function" ? n.read(i, o, c, u, a, m) : new Promise((s, l) => {
      n.read(i, o, c, u, a, (y, f, d) => {
        if (y)
          return l(y);
        s({ bytesRead: f, buffer: d });
      });
    });
  }, e.write = function(i, o, ...c) {
    return typeof c[c.length - 1] == "function" ? n.write(i, o, ...c) : new Promise((u, a) => {
      n.write(i, o, ...c, (m, s, l) => {
        if (m)
          return a(m);
        u({ bytesWritten: s, buffer: l });
      });
    });
  }, e.readv = function(i, o, ...c) {
    return typeof c[c.length - 1] == "function" ? n.readv(i, o, ...c) : new Promise((u, a) => {
      n.readv(i, o, ...c, (m, s, l) => {
        if (m)
          return a(m);
        u({ bytesRead: s, buffers: l });
      });
    });
  }, e.writev = function(i, o, ...c) {
    return typeof c[c.length - 1] == "function" ? n.writev(i, o, ...c) : new Promise((u, a) => {
      n.writev(i, o, ...c, (m, s, l) => {
        if (m)
          return a(m);
        u({ bytesWritten: s, buffers: l });
      });
    });
  }, typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(re);
var Ke = {}, Ot = {};
const Un = P;
Ot.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Un.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Dt = re, { checkPath: Pt } = Ot, Nt = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Ke.makeDir = async (e, t) => (Pt(e), Dt.mkdir(e, {
  mode: Nt(t),
  recursive: !0
}));
Ke.makeDirSync = (e, t) => (Pt(e), Dt.mkdirSync(e, {
  mode: Nt(t),
  recursive: !0
}));
const qn = J.fromPromise, { makeDir: Bn, makeDirSync: Te } = Ke, Le = qn(Bn);
var K = {
  mkdirs: Le,
  mkdirsSync: Te,
  // alias
  mkdirp: Le,
  mkdirpSync: Te,
  ensureDir: Le,
  ensureDirSync: Te
};
const Gn = J.fromPromise, Ct = re;
function Yn(e) {
  return Ct.access(e).then(() => !0).catch(() => !1);
}
var ie = {
  pathExists: Gn(Yn),
  pathExistsSync: Ct.existsSync
};
const ce = q;
function Kn(e, t, n, r) {
  ce.open(e, "r+", (i, o) => {
    if (i)
      return r(i);
    ce.futimes(o, t, n, (c) => {
      ce.close(o, (u) => {
        r && r(c || u);
      });
    });
  });
}
function Vn(e, t, n) {
  const r = ce.openSync(e, "r+");
  return ce.futimesSync(r, t, n), ce.closeSync(r);
}
var It = {
  utimesMillis: Kn,
  utimesMillisSync: Vn
};
const ue = re, C = P, zn = P;
function Qn(e, t, n) {
  const r = n.dereference ? (i) => ue.stat(i, { bigint: !0 }) : (i) => ue.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT")
        return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Hn(e, t, n) {
  let r;
  const i = n.dereference ? (c) => ue.statSync(c, { bigint: !0 }) : (c) => ue.lstatSync(c, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (c) {
    if (c.code === "ENOENT")
      return { srcStat: o, destStat: null };
    throw c;
  }
  return { srcStat: o, destStat: r };
}
function Xn(e, t, n, r, i) {
  zn.callbackify(Qn)(e, t, r, (o, c) => {
    if (o)
      return i(o);
    const { srcStat: u, destStat: a } = c;
    if (a) {
      if (ve(u, a)) {
        const m = C.basename(e), s = C.basename(t);
        return n === "move" && m !== s && m.toLowerCase() === s.toLowerCase() ? i(null, { srcStat: u, destStat: a, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (u.isDirectory() && !a.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!u.isDirectory() && a.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return u.isDirectory() && Ve(e, t) ? i(new Error(Oe(e, t, n))) : i(null, { srcStat: u, destStat: a });
  });
}
function Zn(e, t, n, r) {
  const { srcStat: i, destStat: o } = Hn(e, t, r);
  if (o) {
    if (ve(i, o)) {
      const c = C.basename(e), u = C.basename(t);
      if (n === "move" && c !== u && c.toLowerCase() === u.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Ve(e, t))
    throw new Error(Oe(e, t, n));
  return { srcStat: i, destStat: o };
}
function Tt(e, t, n, r, i) {
  const o = C.resolve(C.dirname(e)), c = C.resolve(C.dirname(n));
  if (c === o || c === C.parse(c).root)
    return i();
  ue.stat(c, { bigint: !0 }, (u, a) => u ? u.code === "ENOENT" ? i() : i(u) : ve(t, a) ? i(new Error(Oe(e, n, r))) : Tt(e, t, c, r, i));
}
function Lt(e, t, n, r) {
  const i = C.resolve(C.dirname(e)), o = C.resolve(C.dirname(n));
  if (o === i || o === C.parse(o).root)
    return;
  let c;
  try {
    c = ue.statSync(o, { bigint: !0 });
  } catch (u) {
    if (u.code === "ENOENT")
      return;
    throw u;
  }
  if (ve(t, c))
    throw new Error(Oe(e, n, r));
  return Lt(e, t, o, r);
}
function ve(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Ve(e, t) {
  const n = C.resolve(e).split(C.sep).filter((i) => i), r = C.resolve(t).split(C.sep).filter((i) => i);
  return n.reduce((i, o, c) => i && r[c] === o, !0);
}
function Oe(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var ae = {
  checkPaths: Xn,
  checkPathsSync: Zn,
  checkParentPaths: Tt,
  checkParentPathsSync: Lt,
  isSrcSubdir: Ve,
  areIdentical: ve
};
const U = q, he = P, er = K.mkdirs, tr = ie.pathExists, nr = It.utimesMillis, Se = ae;
function rr(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Se.checkPaths(e, t, "copy", n, (i, o) => {
    if (i)
      return r(i);
    const { srcStat: c, destStat: u } = o;
    Se.checkParentPaths(e, c, t, "copy", (a) => {
      if (a)
        return r(a);
      xt(e, t, n, (m, s) => {
        if (m)
          return r(m);
        if (!s)
          return r();
        ir(u, e, t, n, r);
      });
    });
  });
}
function ir(e, t, n, r, i) {
  const o = he.dirname(n);
  tr(o, (c, u) => {
    if (c)
      return i(c);
    if (u)
      return Je(e, t, n, r, i);
    er(o, (a) => a ? i(a) : Je(e, t, n, r, i));
  });
}
function xt(e, t, n, r) {
  if (!n.filter)
    return r(null, !0);
  Promise.resolve(n.filter(e, t)).then((i) => r(null, i), (i) => r(i));
}
function Je(e, t, n, r, i) {
  (r.dereference ? U.stat : U.lstat)(t, (c, u) => c ? i(c) : u.isDirectory() ? lr(u, e, t, n, r, i) : u.isFile() || u.isCharacterDevice() || u.isBlockDevice() ? or(u, e, t, n, r, i) : u.isSymbolicLink() ? dr(e, t, n, r, i) : u.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : u.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function or(e, t, n, r, i, o) {
  return t ? cr(e, n, r, i, o) : Rt(e, n, r, i, o);
}
function cr(e, t, n, r, i) {
  if (r.overwrite)
    U.unlink(n, (o) => o ? i(o) : Rt(e, t, n, r, i));
  else
    return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Rt(e, t, n, r, i) {
  U.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? ur(e.mode, t, n, i) : De(n, e.mode, i));
}
function ur(e, t, n, r) {
  return sr(e) ? ar(n, e, (i) => i ? r(i) : ct(e, t, n, r)) : ct(e, t, n, r);
}
function sr(e) {
  return (e & 128) === 0;
}
function ar(e, t, n) {
  return De(e, t | 128, n);
}
function ct(e, t, n, r) {
  fr(t, n, (i) => i ? r(i) : De(n, e, r));
}
function De(e, t, n) {
  return U.chmod(e, t, n);
}
function fr(e, t, n) {
  U.stat(e, (r, i) => r ? n(r) : nr(t, i.atime, i.mtime, n));
}
function lr(e, t, n, r, i, o) {
  return t ? At(n, r, i, o) : yr(e.mode, n, r, i, o);
}
function yr(e, t, n, r, i) {
  U.mkdir(n, (o) => {
    if (o)
      return i(o);
    At(t, n, r, (c) => c ? i(c) : De(n, e, i));
  });
}
function At(e, t, n, r) {
  U.readdir(e, (i, o) => i ? r(i) : Ue(o, e, t, n, r));
}
function Ue(e, t, n, r, i) {
  const o = e.pop();
  return o ? mr(e, o, t, n, r, i) : i();
}
function mr(e, t, n, r, i, o) {
  const c = he.join(n, t), u = he.join(r, t);
  xt(c, u, i, (a, m) => {
    if (a)
      return o(a);
    if (!m)
      return Ue(e, n, r, i, o);
    Se.checkPaths(c, u, "copy", i, (s, l) => {
      if (s)
        return o(s);
      const { destStat: y } = l;
      Je(y, c, u, i, (f) => f ? o(f) : Ue(e, n, r, i, o));
    });
  });
}
function dr(e, t, n, r, i) {
  U.readlink(t, (o, c) => {
    if (o)
      return i(o);
    if (r.dereference && (c = he.resolve(process.cwd(), c)), e)
      U.readlink(n, (u, a) => u ? u.code === "EINVAL" || u.code === "UNKNOWN" ? U.symlink(c, n, i) : i(u) : (r.dereference && (a = he.resolve(process.cwd(), a)), Se.isSrcSubdir(c, a) ? i(new Error(`Cannot copy '${c}' to a subdirectory of itself, '${a}'.`)) : Se.isSrcSubdir(a, c) ? i(new Error(`Cannot overwrite '${a}' with '${c}'.`)) : hr(c, n, i)));
    else
      return U.symlink(c, n, i);
  });
}
function hr(e, t, n) {
  U.unlink(t, (r) => r ? n(r) : U.symlink(e, t, n));
}
var Sr = rr;
const M = q, pe = P, pr = K.mkdirsSync, wr = It.utimesMillisSync, we = ae;
function vr(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = we.checkPathsSync(e, t, "copy", n);
  if (we.checkParentPathsSync(e, r, t, "copy"), n.filter && !n.filter(e, t))
    return;
  const o = pe.dirname(t);
  return M.existsSync(o) || pr(o), bt(i, e, t, n);
}
function bt(e, t, n, r) {
  const o = (r.dereference ? M.statSync : M.lstatSync)(t);
  if (o.isDirectory())
    return Or(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice())
    return Er(o, e, t, n, r);
  if (o.isSymbolicLink())
    return Nr(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Er(e, t, n, r, i) {
  return t ? $r(e, n, r, i) : jt(e, n, r, i);
}
function $r(e, t, n, r) {
  if (r.overwrite)
    return M.unlinkSync(n), jt(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function jt(e, t, n, r) {
  return M.copyFileSync(t, n), r.preserveTimestamps && gr(e.mode, t, n), ze(n, e.mode);
}
function gr(e, t, n) {
  return kr(e) && Fr(n, e), _r(t, n);
}
function kr(e) {
  return (e & 128) === 0;
}
function Fr(e, t) {
  return ze(e, t | 128);
}
function ze(e, t) {
  return M.chmodSync(e, t);
}
function _r(e, t) {
  const n = M.statSync(e);
  return wr(t, n.atime, n.mtime);
}
function Or(e, t, n, r, i) {
  return t ? Mt(n, r, i) : Dr(e.mode, n, r, i);
}
function Dr(e, t, n, r) {
  return M.mkdirSync(n), Mt(t, n, r), ze(n, e);
}
function Mt(e, t, n) {
  M.readdirSync(e).forEach((r) => Pr(r, e, t, n));
}
function Pr(e, t, n, r) {
  const i = pe.join(t, e), o = pe.join(n, e);
  if (r.filter && !r.filter(i, o))
    return;
  const { destStat: c } = we.checkPathsSync(i, o, "copy", r);
  return bt(c, i, o, r);
}
function Nr(e, t, n, r) {
  let i = M.readlinkSync(t);
  if (r.dereference && (i = pe.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = M.readlinkSync(n);
    } catch (c) {
      if (c.code === "EINVAL" || c.code === "UNKNOWN")
        return M.symlinkSync(i, n);
      throw c;
    }
    if (r.dereference && (o = pe.resolve(process.cwd(), o)), we.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (we.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Cr(i, n);
  } else
    return M.symlinkSync(i, n);
}
function Cr(e, t) {
  return M.unlinkSync(t), M.symlinkSync(e, t);
}
var Ir = vr;
const Tr = J.fromCallback;
var Qe = {
  copy: Tr(Sr),
  copySync: Ir
};
const Wt = q, Lr = J.fromCallback;
function xr(e, t) {
  Wt.rm(e, { recursive: !0, force: !0 }, t);
}
function Rr(e) {
  Wt.rmSync(e, { recursive: !0, force: !0 });
}
var Pe = {
  remove: Lr(xr),
  removeSync: Rr
};
const Ar = J.fromPromise, Jt = re, Ut = P, qt = K, Bt = Pe, ut = Ar(async function(t) {
  let n;
  try {
    n = await Jt.readdir(t);
  } catch {
    return qt.mkdirs(t);
  }
  return Promise.all(n.map((r) => Bt.remove(Ut.join(t, r))));
});
function st(e) {
  let t;
  try {
    t = Jt.readdirSync(e);
  } catch {
    return qt.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Ut.join(e, n), Bt.removeSync(n);
  });
}
var br = {
  emptyDirSync: st,
  emptydirSync: st,
  emptyDir: ut,
  emptydir: ut
};
const jr = J.fromCallback, Gt = P, ee = q, Yt = K;
function Mr(e, t) {
  function n() {
    ee.writeFile(e, "", (r) => {
      if (r)
        return t(r);
      t();
    });
  }
  ee.stat(e, (r, i) => {
    if (!r && i.isFile())
      return t();
    const o = Gt.dirname(e);
    ee.stat(o, (c, u) => {
      if (c)
        return c.code === "ENOENT" ? Yt.mkdirs(o, (a) => {
          if (a)
            return t(a);
          n();
        }) : t(c);
      u.isDirectory() ? n() : ee.readdir(o, (a) => {
        if (a)
          return t(a);
      });
    });
  });
}
function Wr(e) {
  let t;
  try {
    t = ee.statSync(e);
  } catch {
  }
  if (t && t.isFile())
    return;
  const n = Gt.dirname(e);
  try {
    ee.statSync(n).isDirectory() || ee.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT")
      Yt.mkdirsSync(n);
    else
      throw r;
  }
  ee.writeFileSync(e, "");
}
var Jr = {
  createFile: jr(Mr),
  createFileSync: Wr
};
const Ur = J.fromCallback, Kt = P, Z = q, Vt = K, qr = ie.pathExists, { areIdentical: zt } = ae;
function Br(e, t, n) {
  function r(i, o) {
    Z.link(i, o, (c) => {
      if (c)
        return n(c);
      n(null);
    });
  }
  Z.lstat(t, (i, o) => {
    Z.lstat(e, (c, u) => {
      if (c)
        return c.message = c.message.replace("lstat", "ensureLink"), n(c);
      if (o && zt(u, o))
        return n(null);
      const a = Kt.dirname(t);
      qr(a, (m, s) => {
        if (m)
          return n(m);
        if (s)
          return r(e, t);
        Vt.mkdirs(a, (l) => {
          if (l)
            return n(l);
          r(e, t);
        });
      });
    });
  });
}
function Gr(e, t) {
  let n;
  try {
    n = Z.lstatSync(t);
  } catch {
  }
  try {
    const o = Z.lstatSync(e);
    if (n && zt(o, n))
      return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Kt.dirname(t);
  return Z.existsSync(r) || Vt.mkdirsSync(r), Z.linkSync(e, t);
}
var Yr = {
  createLink: Ur(Br),
  createLinkSync: Gr
};
const te = P, ye = q, Kr = ie.pathExists;
function Vr(e, t, n) {
  if (te.isAbsolute(e))
    return ye.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = te.dirname(t), i = te.join(r, e);
    return Kr(i, (o, c) => o ? n(o) : c ? n(null, {
      toCwd: i,
      toDst: e
    }) : ye.lstat(e, (u) => u ? (u.message = u.message.replace("lstat", "ensureSymlink"), n(u)) : n(null, {
      toCwd: e,
      toDst: te.relative(r, e)
    })));
  }
}
function zr(e, t) {
  let n;
  if (te.isAbsolute(e)) {
    if (n = ye.existsSync(e), !n)
      throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = te.dirname(t), i = te.join(r, e);
    if (n = ye.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = ye.existsSync(e), !n)
      throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: te.relative(r, e)
    };
  }
}
var Qr = {
  symlinkPaths: Vr,
  symlinkPathsSync: zr
};
const Qt = q;
function Hr(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t)
    return n(null, t);
  Qt.lstat(e, (r, i) => {
    if (r)
      return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Xr(e, t) {
  let n;
  if (t)
    return t;
  try {
    n = Qt.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Zr = {
  symlinkType: Hr,
  symlinkTypeSync: Xr
};
const ei = J.fromCallback, Ht = P, Y = re, Xt = K, ti = Xt.mkdirs, ni = Xt.mkdirsSync, Zt = Qr, ri = Zt.symlinkPaths, ii = Zt.symlinkPathsSync, en = Zr, oi = en.symlinkType, ci = en.symlinkTypeSync, ui = ie.pathExists, { areIdentical: tn } = ae;
function si(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Y.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Y.stat(e),
      Y.stat(t)
    ]).then(([c, u]) => {
      if (tn(c, u))
        return r(null);
      at(e, t, n, r);
    }) : at(e, t, n, r);
  });
}
function at(e, t, n, r) {
  ri(e, t, (i, o) => {
    if (i)
      return r(i);
    e = o.toDst, oi(o.toCwd, n, (c, u) => {
      if (c)
        return r(c);
      const a = Ht.dirname(t);
      ui(a, (m, s) => {
        if (m)
          return r(m);
        if (s)
          return Y.symlink(e, t, u, r);
        ti(a, (l) => {
          if (l)
            return r(l);
          Y.symlink(e, t, u, r);
        });
      });
    });
  });
}
function ai(e, t, n) {
  let r;
  try {
    r = Y.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const u = Y.statSync(e), a = Y.statSync(t);
    if (tn(u, a))
      return;
  }
  const i = ii(e, t);
  e = i.toDst, n = ci(i.toCwd, n);
  const o = Ht.dirname(t);
  return Y.existsSync(o) || ni(o), Y.symlinkSync(e, t, n);
}
var fi = {
  createSymlink: ei(si),
  createSymlinkSync: ai
};
const { createFile: ft, createFileSync: lt } = Jr, { createLink: yt, createLinkSync: mt } = Yr, { createSymlink: dt, createSymlinkSync: ht } = fi;
var li = {
  // file
  createFile: ft,
  createFileSync: lt,
  ensureFile: ft,
  ensureFileSync: lt,
  // link
  createLink: yt,
  createLinkSync: mt,
  ensureLink: yt,
  ensureLinkSync: mt,
  // symlink
  createSymlink: dt,
  createSymlinkSync: ht,
  ensureSymlink: dt,
  ensureSymlinkSync: ht
};
function yi(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function mi(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var He = { stringify: yi, stripBom: mi };
let se;
try {
  se = q;
} catch {
  se = P;
}
const Ne = J, { stringify: nn, stripBom: rn } = He;
async function di(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || se, r = "throws" in t ? t.throws : !0;
  let i = await Ne.fromCallback(n.readFile)(e, t);
  i = rn(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (c) {
    if (r)
      throw c.message = `${e}: ${c.message}`, c;
    return null;
  }
  return o;
}
const hi = Ne.fromPromise(di);
function Si(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || se, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = rn(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function pi(e, t, n = {}) {
  const r = n.fs || se, i = nn(t, n);
  await Ne.fromCallback(r.writeFile)(e, i, n);
}
const wi = Ne.fromPromise(pi);
function vi(e, t, n = {}) {
  const r = n.fs || se, i = nn(t, n);
  return r.writeFileSync(e, i, n);
}
const Ei = {
  readFile: hi,
  readFileSync: Si,
  writeFile: wi,
  writeFileSync: vi
};
var $i = Ei;
const ke = $i;
var gi = {
  // jsonfile exports
  readJson: ke.readFile,
  readJsonSync: ke.readFileSync,
  writeJson: ke.writeFile,
  writeJsonSync: ke.writeFileSync
};
const ki = J.fromCallback, me = q, on = P, cn = K, Fi = ie.pathExists;
function _i(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = on.dirname(e);
  Fi(i, (o, c) => {
    if (o)
      return r(o);
    if (c)
      return me.writeFile(e, t, n, r);
    cn.mkdirs(i, (u) => {
      if (u)
        return r(u);
      me.writeFile(e, t, n, r);
    });
  });
}
function Oi(e, ...t) {
  const n = on.dirname(e);
  if (me.existsSync(n))
    return me.writeFileSync(e, ...t);
  cn.mkdirsSync(n), me.writeFileSync(e, ...t);
}
var Xe = {
  outputFile: ki(_i),
  outputFileSync: Oi
};
const { stringify: Di } = He, { outputFile: Pi } = Xe;
async function Ni(e, t, n = {}) {
  const r = Di(t, n);
  await Pi(e, r, n);
}
var Ci = Ni;
const { stringify: Ii } = He, { outputFileSync: Ti } = Xe;
function Li(e, t, n) {
  const r = Ii(t, n);
  Ti(e, r, n);
}
var xi = Li;
const Ri = J.fromPromise, W = gi;
W.outputJson = Ri(Ci);
W.outputJsonSync = xi;
W.outputJSON = W.outputJson;
W.outputJSONSync = W.outputJsonSync;
W.writeJSON = W.writeJson;
W.writeJSONSync = W.writeJsonSync;
W.readJSON = W.readJson;
W.readJSONSync = W.readJsonSync;
var Ai = W;
const bi = q, qe = P, ji = Qe.copy, un = Pe.remove, Mi = K.mkdirp, Wi = ie.pathExists, St = ae;
function Ji(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  St.checkPaths(e, t, "move", n, (o, c) => {
    if (o)
      return r(o);
    const { srcStat: u, isChangingCase: a = !1 } = c;
    St.checkParentPaths(e, u, t, "move", (m) => {
      if (m)
        return r(m);
      if (Ui(t))
        return pt(e, t, i, a, r);
      Mi(qe.dirname(t), (s) => s ? r(s) : pt(e, t, i, a, r));
    });
  });
}
function Ui(e) {
  const t = qe.dirname(e);
  return qe.parse(t).root === t;
}
function pt(e, t, n, r, i) {
  if (r)
    return xe(e, t, n, i);
  if (n)
    return un(t, (o) => o ? i(o) : xe(e, t, n, i));
  Wi(t, (o, c) => o ? i(o) : c ? i(new Error("dest already exists.")) : xe(e, t, n, i));
}
function xe(e, t, n, r) {
  bi.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : qi(e, t, n, r) : r());
}
function qi(e, t, n, r) {
  ji(e, t, {
    overwrite: n,
    errorOnExist: !0,
    preserveTimestamps: !0
  }, (o) => o ? r(o) : un(e, r));
}
var Bi = Ji;
const sn = q, Be = P, Gi = Qe.copySync, an = Pe.removeSync, Yi = K.mkdirpSync, wt = ae;
function Ki(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = wt.checkPathsSync(e, t, "move", n);
  return wt.checkParentPathsSync(e, i, t, "move"), Vi(t) || Yi(Be.dirname(t)), zi(e, t, r, o);
}
function Vi(e) {
  const t = Be.dirname(e);
  return Be.parse(t).root === t;
}
function zi(e, t, n, r) {
  if (r)
    return Re(e, t, n);
  if (n)
    return an(t), Re(e, t, n);
  if (sn.existsSync(t))
    throw new Error("dest already exists.");
  return Re(e, t, n);
}
function Re(e, t, n) {
  try {
    sn.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV")
      throw r;
    return Qi(e, t, n);
  }
}
function Qi(e, t, n) {
  return Gi(e, t, {
    overwrite: n,
    errorOnExist: !0,
    preserveTimestamps: !0
  }), an(e);
}
var Hi = Ki;
const Xi = J.fromCallback;
var Zi = {
  move: Xi(Bi),
  moveSync: Hi
}, le = {
  // Export promiseified graceful-fs:
  ...re,
  // Export extra methods:
  ...Qe,
  ...br,
  ...li,
  ...Ai,
  ...K,
  ...Zi,
  ...Xe,
  ...ie,
  ...Pe
};
const eo = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class uo {
  scheme;
  db_path;
  constructor(t, n) {
    this.scheme = t, this.db_path = n || process.cwd();
  }
  getDBPath() {
    return Ae.join(this.db_path, "database.json");
  }
  async get_db() {
    const t = this.getDBPath();
    if (await le.ensureFile(t), !await le.pathExists(t))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await Me(t, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(t) {
    const n = this.getDBPath(), r = Ae.join(n, "..", "database_bak.json");
    await le.pathExists(n) && await le.copyFile(n, r), await kt(n, JSON.stringify(t));
    try {
      JSON.parse(await Me(n, "utf8"));
    } catch (i) {
      console.error("rollback", i.message ?? i.toString()), await le.move(r, n, { overwrite: !0 });
    }
  }
  init_empty_value(t) {
    return eo[this.scheme[t]]();
  }
  async get_value(t) {
    let r = (await this.get_db())[t];
    return r == null && (r = this.init_empty_value(t)), r;
  }
  async set_value(t, n) {
    const r = await this.get_db();
    r[t] = n, await this.save_db(r);
  }
}
export {
  uo as storage_helper
};

import T from "node:path";
import i from "node:fs";
import { promisify as o } from "node:util";
import { ensureFile as q, pathExists as k, copyFile as $, move as j } from "fs-extra";
const E = {}, p = (t, e) => function(...n) {
  return t.apply(void 0, n).catch(e);
}, w = (t, e) => function(...n) {
  try {
    return t.apply(void 0, n);
  } catch (c) {
    return e(c);
  }
}, W = E.getuid ? !E.getuid() : !1, B = 1e4, l = () => {
}, s = {
  /* API */
  isChangeErrorOk: (t) => {
    if (!s.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "ENOSYS" || !W && (e === "EINVAL" || e === "EPERM");
  },
  isNodeError: (t) => t instanceof Error,
  isRetriableError: (t) => {
    if (!s.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "EMFILE" || e === "ENFILE" || e === "EAGAIN" || e === "EBUSY" || e === "EACCESS" || e === "EACCES" || e === "EACCS" || e === "EPERM";
  },
  onChangeError: (t) => {
    if (!s.isNodeError(t))
      throw t;
    if (!s.isChangeErrorOk(t))
      throw t;
  }
};
class G {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = B, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (e) => {
      this.queueWaiting.add(e), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (e) => {
      this.queueWaiting.delete(e), this.queueActive.delete(e);
    }, this.schedule = () => new Promise((e) => {
      const r = () => this.remove(n), n = () => e(r);
      this.add(n);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const e of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(e), this.queueActive.add(e), e();
        }
      }
    };
  }
}
const z = new G(), g = (t, e) => function(n) {
  return function c(...y) {
    return z.schedule().then((m) => {
      const d = (S) => (m(), S), h = (S) => {
        if (m(), Date.now() >= n)
          throw S;
        if (e(S)) {
          const _ = Math.round(100 * Math.random());
          return new Promise((I) => setTimeout(I, _)).then(() => c.apply(void 0, y));
        }
        throw S;
      };
      return t.apply(void 0, y).then(d, h);
    });
  };
}, b = (t, e) => function(n) {
  return function c(...y) {
    try {
      return t.apply(void 0, y);
    } catch (m) {
      if (Date.now() > n)
        throw m;
      if (e(m))
        return c.apply(void 0, y);
      throw m;
    }
  };
}, a = {
  attempt: {
    /* ASYNC */
    chmod: p(o(i.chmod), s.onChangeError),
    chown: p(o(i.chown), s.onChangeError),
    close: p(o(i.close), l),
    fsync: p(o(i.fsync), l),
    mkdir: p(o(i.mkdir), l),
    realpath: p(o(i.realpath), l),
    stat: p(o(i.stat), l),
    unlink: p(o(i.unlink), l),
    /* SYNC */
    chmodSync: w(i.chmodSync, s.onChangeError),
    chownSync: w(i.chownSync, s.onChangeError),
    closeSync: w(i.closeSync, l),
    existsSync: w(i.existsSync, l),
    fsyncSync: w(i.fsync, l),
    mkdirSync: w(i.mkdirSync, l),
    realpathSync: w(i.realpathSync, l),
    statSync: w(i.statSync, l),
    unlinkSync: w(i.unlinkSync, l)
  },
  retry: {
    /* ASYNC */
    close: g(o(i.close), s.isRetriableError),
    fsync: g(o(i.fsync), s.isRetriableError),
    open: g(o(i.open), s.isRetriableError),
    readFile: g(o(i.readFile), s.isRetriableError),
    rename: g(o(i.rename), s.isRetriableError),
    stat: g(o(i.stat), s.isRetriableError),
    write: g(o(i.write), s.isRetriableError),
    writeFile: g(o(i.writeFile), s.isRetriableError),
    /* SYNC */
    closeSync: b(i.closeSync, s.isRetriableError),
    fsyncSync: b(i.fsyncSync, s.isRetriableError),
    openSync: b(i.openSync, s.isRetriableError),
    readFileSync: b(i.readFileSync, s.isRetriableError),
    renameSync: b(i.renameSync, s.isRetriableError),
    statSync: b(i.statSync, s.isRetriableError),
    writeSync: b(i.writeSync, s.isRetriableError),
    writeFileSync: b(i.writeFileSync, s.isRetriableError)
  }
}, P = "utf8", N = 438, J = 511, Q = {}, L = {}, Y = E.userInfo().uid, H = E.userInfo().gid, x = 7500, V = !!E.getuid;
E.getuid && E.getuid();
const C = 128, X = (t) => t instanceof Error && "code" in t, K = (t) => typeof t == "function", F = (t) => typeof t == "string", v = (t) => t === void 0, R = {}, D = {
  /* API */
  next: (t) => {
    const e = R[t];
    if (!e)
      return;
    e.shift();
    const r = e[0];
    r ? r(() => D.next(t)) : delete R[t];
  },
  schedule: (t) => new Promise((e) => {
    let r = R[t];
    r || (r = R[t] = []), r.push(e), !(r.length > 1) && e(() => D.next(t));
  })
};
class Z {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exit = () => {
      for (const e of this.callbacks)
        e();
    }, this.hook = () => {
      window.addEventListener("beforeunload", this.exit);
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const ee = new Z(), te = ee.register, u = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (t) => {
    const e = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), c = `.tmp-${Date.now().toString().slice(-10)}${e}`;
    return `${t}${c}`;
  },
  get: (t, e, r = !0) => {
    const n = u.truncate(e(t));
    return n in u.store ? u.get(t, e, r) : (u.store[n] = r, [n, () => delete u.store[n]]);
  },
  purge: (t) => {
    u.store[t] && (delete u.store[t], a.attempt.unlink(t));
  },
  purgeSync: (t) => {
    u.store[t] && (delete u.store[t], a.attempt.unlinkSync(t));
  },
  purgeSyncAll: () => {
    for (const t in u.store)
      u.purgeSync(t);
  },
  truncate: (t) => {
    const e = T.basename(t);
    if (e.length <= C)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - C;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
te(u.purgeSyncAll);
function O(t, e = Q) {
  if (F(e))
    return O(t, { encoding: e });
  const r = Date.now() + ((e.timeout ?? x) || -1);
  return a.retry.readFile(r)(t, e);
}
function M(t, e, r, n) {
  if (K(r))
    return M(t, e, L, r);
  const c = U(t, e, r);
  return n && c.then(n, n), c;
}
async function U(t, e, r = L) {
  if (F(r))
    return U(t, e, { encoding: r });
  const n = Date.now() + ((r.timeout ?? x) || -1);
  let c = null, y = null, m = null, d = null, h = null;
  try {
    r.schedule && (c = await r.schedule(t)), y = await D.schedule(t);
    const S = await a.attempt.realpath(t), _ = !!S;
    t = S || t, [d, m] = u.get(t, r.tmpCreate || u.create, r.tmpPurge !== !1);
    const A = V && v(r.chown), I = v(r.mode);
    if (_ && (A || I)) {
      const f = await a.attempt.stat(t);
      f && (r = { ...r }, A && (r.chown = { uid: f.uid, gid: f.gid }), I && (r.mode = f.mode));
    }
    if (!_) {
      const f = T.dirname(t);
      await a.attempt.mkdir(f, {
        mode: J,
        recursive: !0
      });
    }
    h = await a.retry.open(n)(d, "w", r.mode || N), r.tmpCreated && r.tmpCreated(d), F(e) ? await a.retry.write(n)(h, e, 0, r.encoding || P) : v(e) || await a.retry.write(n)(h, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? await a.retry.fsync(n)(h) : a.attempt.fsync(h)), await a.retry.close(n)(h), h = null, r.chown && (r.chown.uid !== Y || r.chown.gid !== H) && await a.attempt.chown(d, r.chown.uid, r.chown.gid), r.mode && r.mode !== N && await a.attempt.chmod(d, r.mode);
    try {
      await a.retry.rename(n)(d, t);
    } catch (f) {
      if (!X(f) || f.code !== "ENAMETOOLONG")
        throw f;
      await a.retry.rename(n)(d, u.truncate(t));
    }
    m(), d = null;
  } finally {
    h && await a.attempt.close(h), d && u.purge(d), c && c(), y && y();
  }
}
const re = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class ae {
  scheme;
  db_path;
  constructor(e, r) {
    this.scheme = e, this.db_path = r || process.cwd();
  }
  getDBPath() {
    return E.join(this.db_path, "database.json");
  }
  async get_db() {
    const e = this.getDBPath();
    if (await q(e), !await k(e))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await O(e, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(e) {
    const r = this.getDBPath(), n = E.join(r, "..", "database_bak.json");
    await k(r) && await $(r, n), await M(r, JSON.stringify(e));
    try {
      JSON.parse(await O(r, "utf8"));
    } catch (c) {
      console.error("rollback", c.message ?? c.toString()), await j(n, r, { overwrite: !0 });
    }
  }
  init_empty_value(e) {
    return re[this.scheme[e]]();
  }
  async get_value(e) {
    let n = (await this.get_db())[e];
    return n == null && (n = this.init_empty_value(e)), n;
  }
  async set_value(e, r) {
    const n = await this.get_db();
    n[e] = r, await this.save_db(n);
  }
}
export {
  ae as storage_helper
};

import d from "path";
import * as h from "fs-extra";
const f = new Error("request for lock canceled");
var p = function(u, e, t, i) {
  function a(r) {
    return r instanceof t ? r : new t(function(n) {
      n(r);
    });
  }
  return new (t || (t = Promise))(function(r, n) {
    function l(s) {
      try {
        o(i.next(s));
      } catch (c) {
        n(c);
      }
    }
    function _(s) {
      try {
        o(i.throw(s));
      } catch (c) {
        n(c);
      }
    }
    function o(s) {
      s.done ? r(s.value) : a(s.value).then(l, _);
    }
    o((i = i.apply(u, e || [])).next());
  });
};
class w {
  constructor(e, t = f) {
    this._value = e, this._cancelError = t, this._weightedQueues = [], this._weightedWaiters = [];
  }
  acquire(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    return new Promise((t, i) => {
      this._weightedQueues[e - 1] || (this._weightedQueues[e - 1] = []), this._weightedQueues[e - 1].push({ resolve: t, reject: i }), this._dispatch();
    });
  }
  runExclusive(e, t = 1) {
    return p(this, void 0, void 0, function* () {
      const [i, a] = yield this.acquire(t);
      try {
        return yield e(i);
      } finally {
        a();
      }
    });
  }
  waitForUnlock(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    return new Promise((t) => {
      this._weightedWaiters[e - 1] || (this._weightedWaiters[e - 1] = []), this._weightedWaiters[e - 1].push(t), this._dispatch();
    });
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(e) {
    this._value = e, this._dispatch();
  }
  release(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    this._value += e, this._dispatch();
  }
  cancel() {
    this._weightedQueues.forEach((e) => e.forEach((t) => t.reject(this._cancelError))), this._weightedQueues = [];
  }
  _dispatch() {
    var e;
    for (let t = this._value; t > 0; t--) {
      const i = (e = this._weightedQueues[t - 1]) === null || e === void 0 ? void 0 : e.shift();
      if (!i)
        continue;
      const a = this._value, r = t;
      this._value -= t, t = this._value + 1, i.resolve([a, this._newReleaser(r)]);
    }
    this._drainUnlockWaiters();
  }
  _newReleaser(e) {
    let t = !1;
    return () => {
      t || (t = !0, this.release(e));
    };
  }
  _drainUnlockWaiters() {
    for (let e = this._value; e > 0; e--)
      this._weightedWaiters[e - 1] && (this._weightedWaiters[e - 1].forEach((t) => t()), this._weightedWaiters[e - 1] = []);
  }
}
var v = function(u, e, t, i) {
  function a(r) {
    return r instanceof t ? r : new t(function(n) {
      n(r);
    });
  }
  return new (t || (t = Promise))(function(r, n) {
    function l(s) {
      try {
        o(i.next(s));
      } catch (c) {
        n(c);
      }
    }
    function _(s) {
      try {
        o(i.throw(s));
      } catch (c) {
        n(c);
      }
    }
    function o(s) {
      s.done ? r(s.value) : a(s.value).then(l, _);
    }
    o((i = i.apply(u, e || [])).next());
  });
};
class m {
  constructor(e) {
    this._semaphore = new w(1, e);
  }
  acquire() {
    return v(this, void 0, void 0, function* () {
      const [, e] = yield this._semaphore.acquire();
      return e;
    });
  }
  runExclusive(e) {
    return this._semaphore.runExclusive(() => e());
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock() {
    return this._semaphore.waitForUnlock();
  }
  release() {
    this._semaphore.isLocked() && this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
}
const b = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class E {
  mutex = new m();
  scheme;
  db_path;
  constructor(e, t) {
    this.scheme = e, this.db_path = t || process.cwd();
  }
  get_db_path() {
    return d.join(this.db_path, "database.json");
  }
  async get_db() {
    const e = this.get_db_path();
    if (await h.ensureFile(e), !await h.pathExists(e))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await h.readFile(e, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(e) {
    await this.mutex.runExclusive(
      async () => {
        const t = this.get_db_path(), i = d.join(t, "..", "database_bak.json");
        await h.pathExists(t) && await h.copyFile(t, i), await h.writeFile(t, JSON.stringify(e), { flag: "w+" });
        try {
          JSON.parse(await h.readFile(t, "utf8"));
        } catch (a) {
          console.error("rollback", a.message ?? a.toString()), await h.move(i, t, { overwrite: !0 });
        }
      }
    );
  }
  init_empty_value(e) {
    return b[this.scheme[e]]();
  }
  async get_value(e) {
    let i = (await this.get_db())[e];
    return i == null && (i = this.init_empty_value(e)), i;
  }
  async set_value(e, t) {
    const i = await this.get_db();
    i[e] = t, await this.save_db(i);
  }
}
export {
  E as storage_helper
};

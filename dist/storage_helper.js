import r from "path";
import * as s from "fs-extra";
import { Mutex as o } from "async-mutex";
const n = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class h {
  mutex = new o();
  scheme;
  constructor(t) {
    this.scheme = t;
  }
  async get_db() {
    const t = r.resolve("database.json");
    await s.ensureFile(t);
    try {
      return JSON.parse(await s.readFile(t, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(t) {
    await this.mutex.runExclusive(
      async () => {
        const e = r.resolve("database.json"), a = r.join(e, "..", "database_bak.json");
        await s.pathExists(e) && await s.copyFile(e, a), await s.writeFile(e, JSON.stringify(t), { flag: "w+" });
        try {
          JSON.parse(await s.readFile(e, "utf8"));
        } catch (i) {
          console.error("rollback", i.message ?? i.toString()), await s.move(a, e, { overwrite: !0 });
        }
      }
    );
  }
  init_empty_value(t) {
    return n[this.scheme[t]]();
  }
  async get_value(t) {
    let a = (await this.get_db())[t];
    return a == null && (a = this.init_empty_value(t)), a;
  }
  async set_value(t, e) {
    const a = await this.get_db();
    a[t] = e, await this.save_db(a);
  }
}
export {
  h as storage_helper
};

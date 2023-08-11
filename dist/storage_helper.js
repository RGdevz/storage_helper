import r from "path";
import * as i from "fs-extra";
import { Mutex as n } from "async-mutex";
const o = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class b {
  mutex = new n();
  scheme;
  db_path;
  constructor(t, a) {
    this.scheme = t, this.db_path = a || process.cwd();
  }
  get_db_path() {
    return r.join(this.db_path, "database.json");
  }
  async get_db() {
    const t = this.get_db_path();
    await i.ensureFile(t);
    try {
      return JSON.parse(await i.readFile(t, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(t) {
    await this.mutex.runExclusive(
      async () => {
        const a = this.get_db_path(), e = r.join(a, "..", "database_bak.json");
        await i.pathExists(a) && await i.copyFile(a, e), await i.writeFile(a, JSON.stringify(t), { flag: "w+" });
        try {
          JSON.parse(await i.readFile(a, "utf8"));
        } catch (s) {
          console.error("rollback", s.message ?? s.toString()), await i.move(e, a, { overwrite: !0 });
        }
      }
    );
  }
  init_empty_value(t) {
    return o[this.scheme[t]]();
  }
  async get_value(t) {
    let e = (await this.get_db())[t];
    return e == null && (e = this.init_empty_value(t)), e;
  }
  async set_value(t, a) {
    const e = await this.get_db();
    e[t] = a, await this.save_db(e);
  }
}
export {
  b as storage_helper
};

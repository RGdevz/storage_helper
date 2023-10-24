import * as i from "D:/git/storage_helper/node_modules/atomically/dist/index.js";
import { ensureFile as n, pathExists as s, copyFile as c, move as h } from "D:/git/storage_helper/node_modules/fs-extra/lib/index.js";
const o = {}, b = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class _ {
  scheme;
  db_path;
  constructor(t, a) {
    this.scheme = t, this.db_path = a || process.cwd();
  }
  getDBPath() {
    return o.join(this.db_path, "database.json");
  }
  async get_db() {
    const t = this.getDBPath();
    if (await n(t), !await s(t))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await i.readFile(t, "utf8"));
    } catch {
    }
    return Object();
  }
  async save_db(t) {
    const a = this.getDBPath(), e = o.join(a, "..", "database_bak.json");
    await s(a) && await c(a, e), await i.writeFile(a, JSON.stringify(t));
    try {
      JSON.parse(await i.readFile(a, "utf8"));
    } catch (r) {
      console.error("rollback", r.message ?? r.toString()), await h(e, a, { overwrite: !0 });
    }
  }
  init_empty_value(t) {
    return b[this.scheme[t]]();
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
  _ as storage_helper
};

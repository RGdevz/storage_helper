import path from "path";
import * as atomically from "atomically";
import { ensureFile, pathExists } from "fs-extra";
const obj_initiator = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class storage_helper {
  scheme;
  db_path;
  constructor(scheme, db_path) {
    this.scheme = scheme;
    this.db_path = db_path || process.cwd();
  }
  getDBPath() {
    return path.join(this.db_path, "database.json");
  }
  async get_db() {
    const the_path = this.getDBPath();
    await ensureFile(the_path);
    if (!await pathExists(the_path))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await atomically.readFile(the_path, "utf8"));
    } catch (e) {
      console.log((e == null ? void 0 : e.message) ?? e.toString());
    }
    return Object();
  }
  async save_db(db) {
    const the_path = this.getDBPath();
    await atomically.writeFile(the_path, JSON.stringify(db));
  }
  init_empty_value(key) {
    return obj_initiator[this.scheme[key]]();
  }
  async get_value(key) {
    const db = await this.get_db();
    let value = db[key];
    if (value == void 0) {
      value = this.init_empty_value(key);
    }
    return value;
  }
  async set_value(key, value) {
    const db = await this.get_db();
    db[key] = value;
    await this.save_db(db);
  }
}
export {
  storage_helper
};

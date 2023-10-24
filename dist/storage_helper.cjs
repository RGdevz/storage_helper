"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const atomically = require("atomically");
const fsExtra = require("fs-extra");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const atomically__namespace = /* @__PURE__ */ _interopNamespaceDefault(atomically);
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
    await fsExtra.ensureFile(the_path);
    if (!await fsExtra.pathExists(the_path))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await atomically__namespace.readFile(the_path, "utf8"));
    } catch (e) {
      console.log((e == null ? void 0 : e.message) ?? e.toString());
    }
    return Object();
  }
  async save_db(db) {
    const the_path = this.getDBPath();
    await atomically__namespace.writeFile(the_path, JSON.stringify(db));
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
exports.storage_helper = storage_helper;

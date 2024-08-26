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
const objInitiator = {
  array: () => Array(),
  string: () => String(),
  number: () => Number()
};
class storage_helper {
  scheme;
  databaseFilePath;
  constructor(scheme, dataPath) {
    this.scheme = scheme;
    if (!dataPath)
      throw new Error("no database file path");
    this.databaseFilePath = dataPath;
  }
  getDBPath() {
    return path.join(this.databaseFilePath, "database.json");
  }
  async getDatabase() {
    const the_path = this.getDBPath();
    await fsExtra.ensureFile(the_path);
    if (!await fsExtra.pathExists(the_path))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await atomically__namespace.readFile(the_path, "utf8"));
    } catch (e) {
    }
    return Object();
  }
  async saveDatabase(db) {
    const the_path = this.getDBPath();
    await atomically__namespace.writeFile(the_path, JSON.stringify(db));
  }
  initEmptyValue(key) {
    return objInitiator[this.scheme[key]]();
  }
  async getValue(key) {
    const db = await this.getDatabase();
    let value = db[key];
    if (value == void 0) {
      value = this.initEmptyValue(key);
    }
    return value;
  }
  async setValue(key, value) {
    const db = await this.getDatabase();
    db[key] = value;
    await this.saveDatabase(db);
  }
}
exports.storage_helper = storage_helper;

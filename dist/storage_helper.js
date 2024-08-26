import path from "path";
import * as atomically from "atomically";
import { ensureFile, pathExists } from "fs-extra";
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
    await ensureFile(the_path);
    if (!await pathExists(the_path))
      throw new Error("failed to create db file");
    try {
      return JSON.parse(await atomically.readFile(the_path, "utf8"));
    } catch (e) {
    }
    return Object();
  }
  async saveDatabase(db) {
    const the_path = this.getDBPath();
    await atomically.writeFile(the_path, JSON.stringify(db));
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
export {
  storage_helper
};

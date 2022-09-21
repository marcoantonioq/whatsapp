class Groups {
  constructor(storage) {
    this.storage = storage || [];
  }

  set values(str) {
    if (str) this.storage.push(str);
  }

  get values() {
    return this.storage;
  }
}

module.exports = Groups;

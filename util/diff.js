class Diff {
  constructor(addedIds = [], removedIds = []) {
    this._addedIds = addedIds;
    this._removedIds = removedIds;
  }

  // get addedIds() {
  //   return this._addedIds;
  // }
  // get removedIds() {
  //   return this._removedIds;
  // }

  hasChanges() {
    return this._addedIds.length > 0 || this._removedIds.length > 0;
  }

  toString() {
    return `+${this._addedIds.join(", ")} / -${this._removedIds.join(", ")}`;
  }
}

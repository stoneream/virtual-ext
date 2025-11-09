class Diff {
  constructor(addedIds, removedIds) {
    this.addedIds = [];
    this.removedIds = [];

    this.addedIds = addedIds;
    this.removedIds = removedIds;
  }

  get addedIds() {
    return this.addedIds;
  }
  get removedIds() {
    return this.removedIds;
  }
}

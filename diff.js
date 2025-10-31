class Diff {
  #addedIds = [];
  #removedIds = [];

  constructor(addedIds, removedIds) {
    this.#addedIds = addedIds;
    this.#removedIds = removedIds;
  }

  get addedIds() {
    return this.#addedIds;
  }
  get removedIds() {
    return this.#removedIds;
  }
}

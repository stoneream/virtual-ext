/**
 * ノブ全体の状態を管理する
 */
class KnobState {
  constructor() {
    this.groups = Array.from({ length: 8 }, (_, i) => new KnobGroup(i));
  }

  getGroup(groupNumber) {
    return this.groups[groupNumber];
  }

  getParameter(groupNumber, parameterNumber) {
    return this.getGroup(groupNumber).getParameter(parameterNumber);
  }
}

/**
 * ノブグループを管理する
 */
class KnobGroup {
  constructor(groupNumber) {
    // インデックスに紐づくため本来は必要ないが便宜上保持する
    this.group_number = groupNumber;

    this.parameters = Array.from({ length: 3 }, (_, i) => new Parameter(i));
  }

  getParameter(parameterNumber) {
    return this.parameters[parameterNumber];
  }

  setParameter(parameterNumber, parameter) {
    this.parameters[parameterNumber].set(parameter);
  }
}

/**
 * ノブのパラメータを管理する
 *
 */
class Parameter {
  constructor(parameterNumber) {
    // インデックスに紐づくため本来は必要ないが便宜上保持する
    this.parameter_number = parameterNumber;

    this.parameter = null;
  }

  set(parameter) {
    this.parameter = parameter;
  }

  get() {
    return this.parameter;
  }
}

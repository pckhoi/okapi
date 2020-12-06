import * as tf from '@tensorflow/tfjs'

export default class RenameColumns {
  names: StringMapType
  log: (...data: any[]) => void = () => {}

  constructor(names: StringMapType) {
    this.names = names
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    const result: tf.TensorContainerObject = {}
    for (let k in value) {
      const v = value[k]
      const newName = this.names[k]
      if (!newName) {
        throw new Error(`column "${k}" not found.`)
      } else {
        result[newName] = v
      }
    }
    return result
  }
}

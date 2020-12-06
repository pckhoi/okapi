import * as tf from '@tensorflow/tfjs'

export default class InsertColumn {
  name: string
  factory: (value: tf.TensorContainerObject, index: number) => tf.TensorContainer
  log: (...data: any[]) => void = () => {}

  constructor(
    name: string,
    factory: (value: tf.TensorContainerObject, index: number) => tf.TensorContainer
  ) {
    this.name = name
    this.factory = factory
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    return {
      ...value,
      [this.name]: this.factory(value, index)
    }
  }
}

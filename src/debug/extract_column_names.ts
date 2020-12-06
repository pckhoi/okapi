import * as tf from '@tensorflow/tfjs'

export default class ExtractColumnNames {
  log: (...data: any[]) => void = () => {}
  callback: (names: string[]) => void
  names?: string[]

  constructor(callback: (names: string[]) => void) {
    this.callback = callback
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    if (!this.names) {
      this.names = []
      for (let k in value) {
        this.names.push(k)
      }
      this.callback(this.names)
    }
    return value
  }
}

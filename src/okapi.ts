import * as tf from '@tensorflow/tfjs'

interface StringMapType {
  [key: string]: string | undefined
}

interface ColNamesHandType {
  [key: string]: StringMapType | undefined
}

interface Op {
  log(...data: any[]): void
  exec(value: tf.TensorContainer, index: number): tf.TensorContainer
}

export default class Engine {
  ops: Op[]
  url: string
  log: (...data: any[]) => void = () => {}

  constructor(url: string, ops: Op[], log: (...data: any[]) => void) {
    this.ops = ops
    for (let op of ops) {
      op.log = log
    }
    this.log = log
    this.url = url
  }

  run() {
    let ind = 0
    return tf.data
      .csv(this.url, { hasHeader: true })
      .take(10) // remove when done debugging
      .map(elem => {
        for (let op of this.ops) {
          try {
            elem = op.exec(elem, ind)
          } catch (e) {
            this.log(e)
            return elem
          }
        }
        ind++
        return elem
      })
  }
}

export class RenameColumns {
  names: StringMapType
  log: (...data: any[]) => void = () => {}

  constructor(names: StringMapType) {
    this.names = names
  }

  exec(value: tf.TensorContainer, index: number): tf.TensorContainer {
    const obj = value as tf.TensorContainerObject
    const result: tf.TensorContainerObject = {}
    for (let k in obj) {
      const v = obj[k]
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

export class InsertColumn {
  name: string
  factory: (value: tf.TensorContainer, index: number) => tf.Tensor
  log: (...data: any[]) => void = () => {}

  constructor(name: string, factory: (value: tf.TensorContainer, index: number) => tf.Tensor) {
    this.name = name
    this.factory = factory
  }

  exec(value: tf.TensorContainer, index: number): tf.TensorContainer {
    return {
      ...(value as tf.TensorContainerObject),
      [this.name]: this.factory(value, index)
    }
  }
}

import * as tf from '@tensorflow/tfjs'

interface Op {
  log(...data: any[]): void
  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject
}

type engineConfig = {
  url: string
  ops: Op[]
  log: (...data: any[]) => void
  take: number | undefined
}

export default class Engine {
  ops: Op[]
  url: string
  log: (...data: any[]) => void = () => {}
  take: number | undefined

  constructor(conf: engineConfig) {
    this.ops = conf.ops
    for (let op of this.ops) {
      op.log = conf.log
    }
    this.log = conf.log
    this.url = conf.url
    this.take = conf.take
  }

  run() {
    let ind = 0
    let ds = tf.data.csv(this.url, { hasHeader: true }) as tf.data.Dataset<tf.TensorContainerObject>
    if (this.take) {
      ds = ds.take(this.take)
    }
    return ds.map(elem => {
      for (let op of this.ops) {
        try {
          elem = op.exec(elem, ind)
        } catch (e) {
          this.log(`Error: ${e.message}`)
          return elem
        }
      }
      ind++
      return elem
    })
  }
}

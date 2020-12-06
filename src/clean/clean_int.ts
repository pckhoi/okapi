import * as tf from '@tensorflow/tfjs'

export const toInt = (v: tf.TensorContainer) => {
  let n = NaN
  if (typeof v === 'number') {
    n = Math.round(v)
  } else if (typeof v === 'string') {
    v = v.replace(',', '')
    if (v.indexOf('.') !== -1) {
      n = Math.round(parseFloat(v))
    } else {
      n = parseInt(v)
    }
  }
  return n
}

export default class CleanInt {
  log: (...data: any[]) => void = () => {}
  names: string[]
  range?: [number, number]

  constructor(names: string[], range?: [number, number]) {
    this.names = names
    this.range = range
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    const obj = { ...value }
    for (let name of this.names) {
      let n = toInt(obj[name])
      if (this.range && !isNaN(n) && (n < this.range[0] || n > this.range[1])) {
        n = NaN
      }
      obj[name] = n
    }
    return obj
  }
}

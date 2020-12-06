import * as tf from '@tensorflow/tfjs'

import { toInt } from './clean_int'

const nonNumberPattern = /[^0-9\.]/
export const toTimeString = (v: tf.TensorContainer) => {
  if (typeof v === 'string') {
    v = v.replace(nonNumberPattern, '')
  }
  let n = toInt(v)
  let s = ''
  if (!isNaN(n)) {
    const minute = n % 100
    const hour = (n - minute) / 100
    if (minute > 60 || hour > 24 || (hour === 24 && minute > 0)) {
      s = ''
    } else {
      s = `${(hour + '').padStart(2, '0')}:${(minute + '').padStart(2, '0')}`
    }
  }
  return s
}

export default class CleanTimeString {
  log: (...data: any[]) => void = () => {}
  names: string[]

  constructor(names: string[]) {
    this.names = names
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    const obj = { ...value }
    for (let name of this.names) {
      let v = obj[name]
      obj[name] = toTimeString(v)
    }
    return obj
  }
}

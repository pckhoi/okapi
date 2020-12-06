import * as tf from '@tensorflow/tfjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const isoDatePattern = /^\d{4}-\d{2}-\d{2}/
const datePattern1 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
const today = dayjs()
export const toDateString = (v: tf.TensorContainer) => {
  let s = ''
  if (typeof v !== 'string') {
    return s
  }
  let d = dayjs('wtf')
  if (v.match(isoDatePattern)) {
    d = dayjs(v, 'YYYY-MM-DD', true)
  } else {
    const match = v.match(datePattern1)
    if (match !== null) {
      const [whole, month, day, year] = match
      d = dayjs(new Date(parseInt(year), parseInt(month), parseInt(day)))
    }
  }
  if (d.isValid() && d > today) {
    d.year(d.year() - 100)
  }
  if (d.isValid()) {
    s = d.format('YYYY-MM-DD')
  }
  return s
}

export default class CleanDateString {
  log: (...data: any[]) => void = () => {}
  names: string[]

  constructor(names: string[]) {
    this.names = names
  }

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    const obj = { ...value }
    for (let name of this.names) {
      let v = obj[name]
      obj[name] = toDateString(v)
    }
    return obj
  }
}

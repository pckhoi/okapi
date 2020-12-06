import * as tf from '@tensorflow/tfjs'

import columnTypes from '../hand/column_types.yaml'

const colTypes = columnTypes as StringMapType

export default class Migrate {
  log: (...data: any[]) => void = () => {}
  processed: boolean = false

  exec(value: tf.TensorContainerObject, index: number): tf.TensorContainerObject {
    if (this.processed) return value
    this.processed = true
    const dateCols = []
    const timeCols = []
    const intCols = []
    const starCols = []
    const ageCols = []
    for (let k in value) {
      const t = colTypes[k]
      if (!t) continue
      switch (t) {
        case 'date':
          dateCols.push(k)
          break
        case 'time':
          timeCols.push(k)
          break
        case 'star':
          starCols.push(k)
          break
        case 'age':
          ageCols.push(k)
          break
        case 'int':
          intCols.push(k)
          break
        default:
      }
    }
    this.log('new operations:')
    if (dateCols.length > 0) {
      this.log(`  new CleanDateString(${JSON.stringify(dateCols)}),`)
    }
    if (timeCols.length > 0) {
      this.log(`  new CleanTimeString(${JSON.stringify(timeCols)}),`)
    }
    if (intCols.length > 0) {
      this.log(`  new CleanInt(${JSON.stringify(intCols)}),`)
    }
    if (ageCols.length > 0) {
      this.log(`  new CleanInt(${JSON.stringify(ageCols)}, [1, 110]),`)
    }
    if (starCols.length > 0) {
      this.log(`  new CleanInt(${JSON.stringify(starCols)}, [1, Infinity]),`)
    }
    return value
  }
}

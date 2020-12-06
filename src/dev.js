import Engine, { RenameColumns, InsertColumn } from './okapi.ts'
import columnNames from './hand/column_names.yaml'

const engine = new Engine(
  'http://localhost:10001/awards_1967-2017_2017-08_p061715.csv',
  [
    new RenameColumns(columnNames['awards_1967-2017_2017-08_p061715']),
    new InsertColumn('row_id', (elem, ind) => ind + 1),
  ],
  (data) => {
    console.log(data)
  }
)
const ds = engine.run()

ds.forEachAsync((elem) => {
  console.log(elem)
})

import Engine, { RenameColumns, InsertColumn, CleanDateString, CleanInt } from './okapi'
import Migrate from './debug/migrate'
import columnNames from './hand/column_names.yaml'

const engine = new Engine({
  url: 'http://localhost:10001/awards_1967-2017_2017-08_p061715.csv',
  ops: [
    new RenameColumns(columnNames['awards_1967-2017_2017-08_p061715']),
    new InsertColumn('row_id', (elem, ind) => ind + 1),
    new CleanDateString([
      'appointed_date',
      'last_promotion_date',
      'resignation_date',
      'award_request_date',
      'award_start_date',
      'award_end_date',
      'ceremony_date'
    ]),
    new CleanInt(['current_star'], [1, Infinity])
    // new Migrate()
  ],
  log: data => {
    console.log(data)
  },
  take: 10
})
const ds = engine.run()

ds.forEachAsync(elem => {
  console.log(elem)
})

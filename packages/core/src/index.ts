import { DataHub, msgBus$ } from './message/msgBus'
import { DateFormatter } from './operators/dateFormatter'
import { Timer } from './operators/timer'

msgBus$.subscribe(msg => {
  console.log(msg)
})

const timer = new Timer()
timer.start()
const formatter = new DateFormatter()

const testEdges = [
  {
    id: 'edge-1',
    source: 'timer-1',
    sourceHandle: 'timestamp',
    target: 'date_formatter_1',
    targetHandle: 'timestamp',
  },
]
const dataHub = new DataHub(testEdges)

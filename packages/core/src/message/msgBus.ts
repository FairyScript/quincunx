import { Subject } from 'rxjs'

interface OperatorMessage {
  id: string
  port: string | symbol
  data: any
}

const testEdges = [
  {
    id: 'edge-1',
    source: 'timer-1',
    sourceHandle: 'timestamp',
    target: 'log-1',
    targetHandle: 'message',
  },
]

export class DataHub {
  constructor() {}
}

//算子内部数据总线
export const msgBus$ = new Subject<OperatorMessage>()
export function sendMsg(msg: OperatorMessage) {
  msgBus$.next(msg)
}

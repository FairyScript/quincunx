import { filter, Subject } from 'rxjs'

interface OperatorMessage {
  id: string
  port: string
  data: any
  type: 'input' | 'output'
}

interface Edge {
  id: string
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
}
type DataAddress = Omit<OperatorMessage, 'data'>

export class DataHub {
  //output -> input[]
  dataMap: Record<string, Record<string, DataAddress>> = {}
  constructor(edges: Edge[]) {
    for (const edge of edges) {
      const sAddr = `${edge.source}:${edge.sourceHandle}`
      const tAddr = `${edge.target}:${edge.targetHandle}`
      if (!this.dataMap[sAddr]) {
        this.dataMap[sAddr] = {}
      }

      this.dataMap[sAddr][tAddr] = {
        id: edge.target,
        port: edge.targetHandle,
        type: 'input',
      }
    }

    this.forward()
  }

  forward() {
    msgBus$.pipe(filter(msg => msg.type === 'output')).subscribe(msg => {
      const addr = `${msg.id}:${msg.port}`
      const targets = this.dataMap[addr]
      if (!targets) return
      for (const target of Object.values(targets)) {
        msgBus$.next({ ...target, data: msg.data })
      }
    })
  }
}

//算子内部数据总线
export const msgBus$ = new Subject<OperatorMessage>()
export function sendMsg(msg: OperatorMessage) {
  msgBus$.next(msg)
}

import { Subject } from 'rxjs'

interface OperatorMessage {
  id: string
  port: string
  data: any
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
  dataMap: Record<string, Record<string, DataAddress>> = {}
  constructor(edges: Edge[]) {
    for (const edge of edges) {
      if (!this.dataMap[edge.source]) {
        this.dataMap[edge.source] = {}
      }
      if (!this.dataMap[edge.target]) {
        this.dataMap[edge.target] = {}
      }
      this.dataMap[edge.source][edge.sourceHandle] = {
        id: edge.target,
        port: edge.targetHandle,
      }
    }

    this.forward()
  }

  forward() {
    msgBus$.subscribe(data => {
      const target = this.dataMap[data.id][data.port]
      if (target) {
        sendMsg({
          id: target.id,
          port: target.port,
          data: data.data,
        })
      }
    })
  }
}

//算子内部数据总线
export const msgBus$ = new Subject<OperatorMessage>()
export function sendMsg(msg: OperatorMessage) {
  msgBus$.next(msg)
}

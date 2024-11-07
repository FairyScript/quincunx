import { Subject } from 'rxjs'

interface OperatorMessage {
  id: string
  port: string
  data: any
}

//算子内部数据总线
export const msgBus$ = new Subject<OperatorMessage>()

import { ProcessNode } from 'quincunx-core'
import { DateFormatter, TimerNode } from 'quincunx-operators'
import { DataHub, msgBus$ } from './msgBus'
import { filter, Subscription } from 'rxjs'
msgBus$.subscribe(msg => {
  console.log(msg)
})

const testEdges = [
  {
    id: 'edge-1',
    source: '2',
    sourceHandle: 'timestamp',
    target: '23',
    targetHandle: 'timestamp',
  },
]

const testNodes = [
  {
    id: '2',
    type: 'Timer',
    data: { interval: 1000 },
    style: { border: '1px solid #777', padding: 10 },
    position: { x: 300, y: 50 },
  },
  {
    id: '23',
    type: 'DateFormatter',
    data: { interval: 1000 },
    style: { border: '1px solid #777', padding: 10 },
    position: { x: 300, y: 50 },
  },
]
type Node = (typeof testNodes)[0]

const nodeMap: Record<string, typeof ProcessNode<any>> = {
  Timer: TimerNode,
  DateFormatter: DateFormatter,
}

class NodeHost {
  nodes: Record<string, ProcessNode<any>> = {}

  constructor() {
    this.listen()
  }

  subHandle?: Subscription
  listen() {
    if (this.subHandle) {
      this.subHandle.unsubscribe()
    }

    this.subHandle = msgBus$
      .pipe(filter(msg => msg.type === 'input'))
      .subscribe(msg => {
        const node = this.nodes[msg.id]
        if (!node) return
        node.inputData[msg.port] = msg.data
      })
  }

  loadNodes(nodes: Node[]) {
    for (const node of nodes) {
      const NodeComp = nodeMap[node.type]
      const nodeInstance = new NodeComp(node.id, node.data)
      nodeInstance.postChange = (key, value) => {
        msgBus$.next({ id: node.id, port: key, data: value, type: 'output' })
      }
      this.nodes[node.id] = nodeInstance
    }
  }

  startAll() {
    for (const key in this.nodes) {
      this.nodes[key].onStart?.()
    }
  }
}

new DataHub(testEdges)
const host = new NodeHost()
host.loadNodes(testNodes)
host.startAll()

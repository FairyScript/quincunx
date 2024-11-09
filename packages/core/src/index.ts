import { DataHub, msgBus$ } from './message/msgBus'
import { ProcessNode } from './operators/base'
import { DateFormatter } from './operators/dateFormatter'
import { TimerNode } from './operators/timer'

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

  loadNodes(nodes: Node[]) {
    for (const node of nodes) {
      const NodeComp = nodeMap[node.type]
      this.nodes[node.id] = new NodeComp(node.id, node.data)
    }
  }

  startAll() {
    for (const key in this.nodes) {
      this.nodes[key].start()
    }
  }
}

new DataHub(testEdges)
const host = new NodeHost()
host.loadNodes(testNodes)
host.startAll()

import { ProcessNode } from 'quincunx-core'
import { DateFormatter, TimerNode } from 'quincunx-operators'
import { DataHub, msgBus$ } from './msgBus'
import { filter, Subscription } from 'rxjs'
import { init, loadRemote } from '@module-federation/enhanced/runtime'
import nodeRuntimePlugin from '@module-federation/node/runtimePlugin'
// 可以只使用运行时加载模块，而不依赖于构建插件
// 当不使用构建插件时，共享的依赖项不能自动设置细节
init({
  name: 'quincunx_worker',
  remotes: [
    {
      name: 'quincunx_operators',
      // mf-manifest.json 是在 Module federation 新版构建工具中生成的文件类型，对比 remoteEntry 提供了更丰富的功能
      // 预加载功能依赖于使用 mf-manifest.json 文件类型
      entry: 'http://localhost:6001/mf-manifest.json',
      alias: 'ops',
    },
  ],
  shared: {
    rxjs: {
      lib: () => require('rxjs'),
    },
    zod: {
      version: '3.23.8',
      lib: () => require('zod'),
    },
  },
  // plugins: [nodeRuntimePlugin()],
})

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
    type: 'timer',
    data: { interval: 1000 },
    style: { border: '1px solid #777', padding: 10 },
    position: { x: 300, y: 50 },
  },
  {
    id: '23',
    type: 'dateFormatter',
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

  async loadNodes(nodes: Node[]) {
    for (const node of nodes) {
      const NodeComp = await loadRemote<typeof ProcessNode<any>>(
        `operators/${node.type}`
      )
      if (!NodeComp) {
        console.error(`Node ${node.type} not found`)
        continue
      }
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
// await host.loadNodes(testNodes)
host.startAll()

loadRemote('ops/timer2').then(console.log)

//实现一个基本的工作流
// 一个采集算子 `timer` 每秒钟发出此刻的时间戳
// 一个处理算子 `formartter` 将时间戳转换为字符串
// 一个输出算子 `logger` 将结果打印到控制台
const nodes = [
  {
    id: 'timer',
    type: 'source',
    ports: [
      {
        id: 'timestamp',
        type: 'output'
      }
    ]
  },
  {
    id: 'formatter',
    type: 'processor',
    ports: [
      {
        id: 'input',
        type: 'input'
      },
      {
        id: 'output',
        type: 'output'
      }
    ]
  },
  {
    id: 'logger',
    type: 'sink',
    ports: [
      {
        id: 'input',
        type: 'input'
      }
    ]
  }
]

const edges = [
  {
    source: {
      nodeId: 'timer',
      portId: 'timestamp'
    },
    target: {
      nodeId: 'formatter',
      portId: 'input'
    }
  },
  {
    source: {
      nodeId: 'formatter',
      portId: 'output'
    },
    target: {
      nodeId: 'logger',
      portId: 'input'
    }
  }
]

const msgBus$ = new Subject()

class Timer {
  constructor() {
    this.id = 'timer'
    this.ports = {
      timestamp: {
        type: 'output'
      }
    }
  }
  start() {
    setInterval(() => {
      msgBus$.next({
        nodeId: this.id,
        portId: 'timestamp',
        data: Date.now()
      })
    }, 1000)
  }
}

class Formatter {
  constructor() {
    this.id = 'formatter'
    this.ports = {
      input: {
        type: 'input'
      },
      output: {
        type: 'output'
      }
    }
  }
  start() {
    msgBus$.pipe(
      filter(msg => msg.nodeId === this.id && msg.portId === 'input')
    ).
      subscribe(msg => {
        const data = msg.data
        const formattedData = new Date(data).toISOString()
        msgBus$.next({
          nodeId: this.id,
          portId: 'output',
          data: formattedData
        })
      })
  }
}

class Logger {
  constructor() {
    this.id = 'logger'
    this.ports = {
      input: {
        type: 'input'
      }
    }
  }
  start() {
    msgBus$.pipe(
      filter(msg => msg.nodeId === this.id && msg.portId === 'input')
    ).
      subscribe(msg => {
        console.log(msg.data)
      })
  }
}
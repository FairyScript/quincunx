import { msgBus$ } from '../../message/msgBus'

interface TimerConfig {
  interval: number
}

const defaultConfig: TimerConfig = {
  interval: 1000,
}

interface Port {
  type: string
}

interface Operator {
  inputs: Record<string, Port>
  outputs: Record<string, Port>
  start(): void
}

class Timer implements Operator {
  static inputs = {}
  static outputs = {
    timestamp: { type: 'number' },
  }

  private interval: number

  constructor(config: TimerConfig = defaultConfig) {
    this.interval = config.interval
  }

  start() {
    setInterval(() => {
      msgBus$.next({
        id: 'timer',
        port: 'timestamp',
        data: Date.now(),
      })
    }, this.interval)
  }
}

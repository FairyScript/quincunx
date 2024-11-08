import { z } from 'zod'
import { Operator } from '../base'

const config = {
  id: 'timer-1',
  name: 'Timer',
  category: 'Operators', //用于分类，仅限前端使用
  scheme: z.object({
    input: z.object({}),
    output: z.object({
      timestamp: z.number().default(0),
    }),
  }),
}

type TimerConfig = typeof config

export class Timer extends Operator<TimerConfig> {
  constructor() {
    super(config)
  }

  async start() {
    setInterval(() => {
      this.outputData.timestamp = Date.now()
    }, 1000)
  }
}

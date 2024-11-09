import { z } from 'zod'
import { ProcessNode } from '../base'

const scheme = {
  inputs: z.object({}),
  outputs: z.object({
    timestamp: z.number().default(0),
  }),
  options: z.object({
    interval: z.number().default(1000),
  }),
}
const config = {
  type: 'Timer',
  category: 'Operators', //用于分类，仅限前端使用
  scheme,
}

type Config = typeof config
type Option = z.infer<Config['scheme']['options']> | undefined

export class TimerNode extends ProcessNode<Config> {
  private interval: number
  constructor(id: string, op: Option) {
    super(id, config)
    const option = scheme.options.parse(op ?? {})
    this.interval = option.interval
  }

  private handle: Timer | null = null

  async start() {
    this.create()
  }

  create() {
    if (this.handle) {
      clearInterval(this.handle)
    }
    this.handle = setInterval(() => {
      this.outputData.timestamp = Date.now()
    }, this.interval)
  }
}

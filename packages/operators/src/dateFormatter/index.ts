import { ProcessNode } from 'quincunx-core'
import { z } from 'zod'

const scheme = {
  inputs: z.object({
    timestamp: z.number().optional(),
  }),
  outputs: z.object({
    timeStr: z.string().default(''),
  }),
  options: z.object({}),
}
const config = {
  type: 'DateFormatter',
  category: 'Operators', //用于分类，仅限前端使用
  scheme,
}

type Config = typeof config
type Option = z.infer<Config['scheme']['options']> | undefined

export class DateFormatter extends ProcessNode<Config> {
  option: Option

  constructor(id: string, op: Option) {
    super(id, config)
    this.option = scheme.options.parse(op ?? {})
  }

  async onInputDataChange() {
    const timestamp = this.inputData.timestamp
    if (!timestamp) return
    this.outputData.timeStr = new Date(timestamp).toLocaleString()
  }
}

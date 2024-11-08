import { z } from 'zod'
import { Operator } from '../base'

const config = {
  id: 'date_formatter_1',
  name: 'Date Formatter',
  category: 'Operators', //用于分类，仅限前端使用
  scheme: z.object({
    input: z.object({
      timestamp: z.number().default(0),
    }),
    output: z.object({
      timeStr: z.string().default(''),
    }),
  }),
}

type TimerConfig = typeof config

export class DateFormatter extends Operator<TimerConfig> {
  constructor() {
    super(config)
  }

  async onInputDataChange() {
    console.log('DateFormatter onInputDataChange');
    
    const timestamp = this.inputData.timestamp
    this.outputData.timeStr = new Date(timestamp).toLocaleString()
  }
}

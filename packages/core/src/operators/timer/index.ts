import { z } from 'zod'
import { sendMsg } from '../../message/msgBus'

interface OperatorConfig<T extends z.ZodObject<any>> {
  id: string
  name: string
  category: string
  scheme: T
}

const config: OperatorConfig = {
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

class Operator<T extends TimerConfig> {
  private config: T

  private inputData: z.infer<T['scheme']['shape']['input']>
  // 只写不读
  private outputData: any

  constructor(config: T) {
    this.config = config
    //init data
    const inputData = config.scheme.shape.input.parse({})
    this.inputData = new Proxy(inputData, {
      set: (target, key, value) => {
        //@ts-expect-error
        target[key] = value
        this.onInputDataChange()
        return value
      },
    })

    const outputData = {}
    this.outputData = new Proxy(outputData, {
      set: (target, key, value) => {
        //@ts-expect-error
        target[key] = value
        this.onOutputDataChange(key, value)
        return value
      },
    })
  }

  async start() {}
  //输入数据变化
  async onInputDataChange() {}
  //输出数据变化
  async onOutputDataChange(key: string | symbol, value: any) {
    //发送消息
    sendMsg({
      id: this.config.id,
      port: key,
      data: value,
    })
  }
}

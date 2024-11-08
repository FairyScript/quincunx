import { z } from 'zod'
import { sendMsg } from '../../message/msgBus'

export interface OperatorConfig<T extends z.ZodObject<any>> {
  id: string
  name: string
  category: string
  scheme: T
}

export class Operator<T extends OperatorConfig<z.ZodObject<any>>> {
  private config: T

  inputData: z.infer<T['scheme']['shape']['input']>
  // 只写不读
  outputData: z.infer<T['scheme']['shape']['output']>

  constructor(config: T) {
    this.config = config
    //init data
    const inputData = config.scheme.shape.input.parse({})
    this.inputData = new Proxy(inputData, {
      set: (target, key, value) => {
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
        this.onOutputDataChange(key as string, value)
        return value
      },
    })
  }

  async start() {}
  //输入数据变化
  async onInputDataChange() {}
  //输出数据变化
  async onOutputDataChange(key: string, value: any) {
    //发送消息
    sendMsg({
      id: this.config.id,
      port: key,
      data: value,
    })
  }
}

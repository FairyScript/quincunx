import { z } from 'zod'

export interface PNodeScheme {
  inputs: z.ZodObject<any>
  outputs: z.ZodObject<any>
  options: z.ZodObject<any>
}

export interface PNodeConfig<T extends PNodeScheme> {
  type: string
  category: string
  scheme: T
}

export class ProcessNode<Config extends PNodeConfig<PNodeScheme>> {
  id: string
  inputData: z.infer<Config['scheme']['inputs']>
  outputData: z.infer<Config['scheme']['outputs']>
  options: z.infer<Config['scheme']['options']>

  constructor(id: string, config: Config) {
    this.options = config
    this.id = id
    //init data
    const inputData = config.scheme.inputs.parse({})
    this.inputData = new Proxy(inputData, {
      set: (target, key, value) => {
        //@ts-expect-error
        target[key] = value
        this.onInputDataChange?.()
        return value
      },
    })

    const outputData = {}
    this.outputData = new Proxy(outputData, {
      set: (target, key, value) => {
        //@ts-expect-error
        target[key] = value
        this.postChange(key as string, value)
        return value
      },
    })
  }

  //输出数据变化
  // 由NodeHost覆盖实现
  postChange(key: string, value: any) {
    console.log('postChange', key, value)
  }

  onStart() {}
  onInputDataChange() {}
  onOptionsChange() {}
}

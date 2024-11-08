export enum PortType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  any = 'any',
}

export interface PortTypeMap {
  [PortType.string]: string
  [PortType.number]: number
  [PortType.boolean]: boolean
  [PortType.object]: object
  [PortType.any]: any
}

export type DiscoveryBridgeDefinition = {
  internalipaddress: string,
  id?: string
}

export type DiscoveryBridgeDescription = {
  name?: string,
  manufacturer?: string,
  ipaddress?: string,
  model?: DiscoveryBridgeModel,
  version?: SpecVersion,
  icons?: DiscoveryBridgeIcon[]
}

export type DiscoveryBridgeModel = {
  number?: string,
  description?: string,
  name?: string,
  serial?: string
}

export type DiscoveryBridgeIcon = {
  mimetype?: string,
  height?: number,
  width?: number,
  depth?: number,
  url?: string,
}

export type SpecVersion = {
  major: string,
  minor: string,
}

export type BridgeConfigData = {
  ipaddress: string,
  name: string,
  modelid: string,
  swversion: string,
}

export type BridgeConfigError = {
  error: {
    message: string,
    description: string,
    ipaddress: string,
    id?: string,
  }
}

export type BridgeDiscoveryResponse = {
  ipaddress: string,
  config?: BridgeConfigData
  error?: BridgeConfigError
}
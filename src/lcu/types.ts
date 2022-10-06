export type iLcuConnectCert = {
  port: number
  token: string
  protocol: 'http' | 'https'
}

export type iLcuConnectSocketMsg<T> = [
  number,
  string,
  {
    data: T
    eventType: string
    uri: string
  }
]

export type iLcuEventType = 'connected' | 'disconnected' | 'message'
export type iLcuEvent = (
  clientIdentification: iLcuClientIdentification,
  message?: iLcuConnectSocketMsg<unknown>
) => void

export type iLcuEventMap = Map<
  symbol,
  {
    type: iLcuEventType
    handler: iLcuEvent
  }
>

export type iLcuClientIdentification = {
  accountId: number
  puuid: string
  displayName: string
}

export type iLcuSummonerInfo = {
  accountId: number
  displayName: string
  internalName: string
  percentCompleteForNextLevel: number
  profileIconId: number
  puuid: string
  rerollPoints: {
    currentPoints: number
    maxRolls: number
    numberOfRolls: number
    pointsCostToRoll: number
    pointsToReroll: number
  }
  summonerId: number
  summonerLevel: number
  xpSinceLastLevel: number
  xpUntilNextLevel: number
}

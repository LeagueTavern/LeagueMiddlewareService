/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-06 23:55:03
 * @FilePath: \LeaugeMiddleware\src\lcu\types.ts
 * @Description: 
 */
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
  nameChangeFlag: boolean,
  privacy: 'PUBLIC' | 'PRIVATE',
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
  unnamed: boolean,
  xpSinceLastLevel: number
  xpUntilNextLevel: number
}
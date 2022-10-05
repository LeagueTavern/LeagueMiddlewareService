export type iLcuConnectCert = {
  port: number
  token: string
  protocol: 'http' | 'https'
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

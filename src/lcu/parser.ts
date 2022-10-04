import type { iLcuConnectCert } from './types'

const commandLineParser = (
  command: string
):
  | ({
      available: true
    } & iLcuConnectCert)
  | {
      available: false
    } => {
  const INSTALL_AUTHTOKEN = /"--remoting-auth-token=(.*?)"/
  const INSTALL_APPPORT = /"--app-port=(.*?)"/
  const INSTALL_PLATFORM = /"--rso_platform_id=(.*?)"/

  const port = command.match(INSTALL_APPPORT)
  const token = command.match(INSTALL_AUTHTOKEN)

  if (port && token) {
    return {
      available: true,
      port: +port[1],
      token: token[1],
      protocol: 'https'
    }
  }

  return { available: false }
}

export { commandLineParser }

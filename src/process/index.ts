/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-06 21:45:10
 * @FilePath: \LeaugeMiddleware\src\process\index.ts
 * @Description:
 */
import os from 'os'
import childProcess from 'child_process'
import type { iProcessCase } from './types'

const option = {
  windowsHide: true
}

// Windows 专属
// 从tasklist获取进程信息
function getProcessList() {
  const command = 'tasklist'
  return new Promise<iProcessCase[]>((resolve, reject) => {
    childProcess.exec(command, option, (err, stdout, stderr) => {
      if (err || !stdout || stderr) {
        return reject(err || stderr)
      }

      const processRaw = stdout.split('\n')
      const processList = processRaw
        .map((raw) => {
          const [processName, processId] = raw.split(/\s+/)
          return {
            processName,
            processId: +processId
          }
        })
        .filter((raw) => raw.processId && raw.processName)
      resolve(processList)
    })
  })
}

// 从wmic获取进程信息
function getProcessFromNameA(name: string) {
  const command = `WMIC PROCESS WHERE name='${name}' GET name,processid`
  return new Promise<iProcessCase[]>((resolve, reject) => {
    childProcess.exec(command, option, (err, stdout, stderr) => {
      if (err || !stdout || stderr) {
        return reject(err || stderr)
      }

      const processRaw = stdout.split('\n')
      const processTemp = processRaw
        .map((raw) => {
          const [processName, processId] = raw.split(/\s+/)
          return {
            processName,
            processId: +processId
          }
        })
        .filter((raw) => raw.processId && raw.processName)

      const processList = processTemp.splice(1, processTemp.length - 1)
      resolve(processList)
    })
  })
}

// 通过进程名获取进程信息
function getProcessFromName(name: string) {
  return new Promise<iProcessCase[]>((resolve, reject) =>
    getProcessList()
      .then((processList) => {
        resolve(processList.filter((process) => process.processName === name))
      })
      .catch(reject)
  )
}

// 从wmic获取进程命令行
function getCommandlineFromPid(processId: number) {
  const command = `WMIC PROCESS WHERE processid=${processId} GET commandline`
  return new Promise<string>((resolve, reject) => {
    childProcess.exec(command, option, (err, stdout, stderr) => {
      if (err || !stdout || stderr) {
        return reject(err || stderr)
      }

      const line = stdout.split('\n')
      if (line.length < 2) {
        return reject()
      }

      resolve(line[1])
    })
  })
}

export {
  getProcessList,
  getProcessFromName,
  getProcessFromNameA,
  getCommandlineFromPid
}

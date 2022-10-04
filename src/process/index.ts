import os from 'os'
import childProcess from 'child_process'
import type { iProcessCase } from './types'

// Windows only
// Get process list from Tasklist
function getProcessList() {
  const command = 'tasklist'
  return new Promise<iProcessCase[]>((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
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

// Get process from WMIC
function getProcessFromNameA(name: string) {
  const command = `WMIC PROCESS WHERE name='${name}' GET name,processid`
  return new Promise<iProcessCase[]>((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
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

// Get process
function getProcessFromName(name: string) {
  return new Promise<iProcessCase[]>((resolve, reject) =>
    getProcessList()
      .then((processList) => {
        resolve(processList.filter((process) => process.processName === name))
      })
      .catch(reject)
  )
}

// Get process commandline from WMIC
function getCommandlineFromPid(processId: number) {
  const command = `WMIC PROCESS WHERE processid=${processId} GET commandline`
  return new Promise<string>((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
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

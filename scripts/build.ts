/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-06 23:22:41
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-03-20 20:18:55
 * @FilePath: \LeagueMiddlewareService\scripts\build.ts
 * @Description:
 */
import exe from '@angablue/exe'
import path from 'path'
import config from '../package.json'

const build = exe({
  entry: './build/index.js',
  out: `./dist/${config.name}.exe`,
  pkg: ['-C', 'GZip'],
  version: config.version,
  target: 'node16-windows-x64',
  icon: './icon/icon.ico',
  properties: {
    FileDescription: config.description,
    ProductName: config.productName,
    LegalCopyright: config.copyright,
    CompanyName: config.author
  }
})

build.then(() => {
  console.log('==========================')
  console.log('Build completed!')
  console.log(
    `Output: ${path.resolve(__dirname, `../dist/${config.name}.exe`)}`
  )
  console.log('==========================')
})

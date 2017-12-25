const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')
const dotenv = require('dotenv')
const parseDoc = require('./parseDoc')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

dotenv.config()
const {
  writeFile,
  startDate,
  endDate,
  url
} = process.env

const writeStream = fs.createWriteStream(writeFile)
const endTime = new Date(endDate).getTime()
const startTime = new Date(startDate).getTime()
collectData(startDate)

function collectData(date) {
  const dateTime = new Date(date).getTime()
  const radio = (dateTime - startTime) / (endTime - startTime) * 100
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(`${date}, ${radio.toFixed(2)}%`)
  if (endTime <= dateTime) {
    writeStream.end()
    console.log('\n Finish collecting the data...')
    rl.close()
    return
  }
  https.get(`${url}${date}`, res => {
    if (res.statusCode !== 200) {
      throw new Error(`status: ${res.statusCode}`)
    }
    let doc = ''
    res.on('data', d => {
      doc += d
    })
    res.on('end', () => {
      let data = parseDoc(cheerio, doc)
      let separator = data.pop()
      writeStream.write(date + separator + data.join(separator) + '\n')
      let newDate = new Date(dateTime + 24 * 60 * 60 * 1000)
      newDate = newDate.toISOString().split('T')[0]
      collectData(newDate)
    })
  }).on('error', e => {
    console.error(e)
  })
}
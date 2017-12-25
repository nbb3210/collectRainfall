// 从doc中获取感兴趣的数据，以数组的形式返回，数组的最后一个表示分割数据的分隔符
// cheerio 相当于node上的jquery
function parseDoc(cheerio, doc) {
  let rainStr = cheerio('.all-day-values li:nth-child(2)', doc).html()
  let rain = rainStr.split(`</strong>`)[1]
  let snowStr = cheerio('.all-day-values li:nth-child(4)', doc).html()
  let snow = snowStr.split(`</strong>`)[1]
  if (snow !== '-') {
    snow = snow.split(' (')[0]
  }
  return [rain, snow, ',']
}

module.exports = parseDoc
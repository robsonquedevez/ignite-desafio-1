import { parse } from 'csv-parse'
import fs from 'node:fs'
import path from 'node:path'

const data = []

fs.createReadStream(path.resolve('desafio.csv'))
.pipe(parse({ delimiter: ',' }))
.on('data', (row) => {
  data.push(row)
})
.on('end', async () => {
  for (var i = 1; i < data.length; i++) {
    await fetch('http://localhost:3333/tasks',{
      method: 'POST',
      body: JSON.stringify({
        title: data[i][0],
        description: data[i][1]
      })
    })

    console.log(data[i])
  } 
})

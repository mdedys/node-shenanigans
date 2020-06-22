const fs = require("fs")

function read(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err)
      }

      const streams = files.map((file) => {
        const stream = fs.readFileSync(`${directory}/${file}`)
        return [file, stream]
      })

      resolve(streams)
    })
  })
}

function readRaw() {
  return read(__dirname + "/../../data/raw")
}

function readClean() {
  return read(__dirname + "/../../data/clean")
}

module.exports.readRaw = readRaw
module.exports.readClean = readClean

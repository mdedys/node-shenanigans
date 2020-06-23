const { parentPort, workerData } = require("worker_threads")
const fs = require("fs")

const { resizeImage } = require("../utils/resizer")

async function resize() {
  try {
    const { path, output } = workerData

    const stream = fs.readFileSync(path)

    const promises = [
      resizeImage(stream, [24, 24], `${output}-24x24.jpg`),
      resizeImage(stream, [64, 64], `${output}-64x64.jpg`),
    ]

    await Promise.all(promises)
    parentPort.postMessage(output)
  } catch (ex) {
    throw ex
  }
}

resize()

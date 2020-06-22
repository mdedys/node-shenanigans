const { parentPort, workerData } = require("worker_threads")
const fs = require("fs")

const { resizeImage } = require("../utils/resizer")

async function resize() {
  try {
    const { path, height, width, output } = workerData
    const stream = fs.readFileSync(path)
    await resizeImage(stream, [width, height], output)
    parentPort.postMessage(output)
  } catch (ex) {
    throw ex
  }
}

resize()

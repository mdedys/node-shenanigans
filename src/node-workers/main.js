const { Worker } = require("worker_threads")
const fs = require("fs")

const { readRaw } = require("../utils/data")

const MAX_THREADS = 2

function resizeImage(path, size, output) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + "/worker.js", {
      workerData: { output, path, height: size[1], width: size[0] },
    })

    worker.on("message", resolve)

    worker.on("error", reject)

    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })
  })
}

async function processImages(directory, files) {
  const threads = []

  for (const file of files) {
    threads.push(
      resizeImage(
        __dirname + `/../../data/raw/${file[0]}`,
        [24, 24],
        `${directory}/${Date.now()}-${file[0]}-24x24.png`
      )
    )

    threads.push(
      resizeImage(
        __dirname + `/../../data/raw/${file[0]}`,
        [64, 64],
        `${directory}/${Date.now()}-${file[0]}-64x64.png`
      )
    )
  }

  const results = await Promise.all(threads)
  console.log("COMPLETED: ", results)
}

async function main() {
  try {
    console.log("Reading raw files")
    const files = await readRaw()
    console.log("Finished reading raw files")

    const directory = __dirname + "/../../data/clean/" + Date.now()
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }

    console.log("Started process of resizing images")
    const start = Date.now()
    await processImages(directory, files)
    const end = Date.now()
    console.log("Completed process of resizing images")
    console.log("Resizing took: " + (end - start) + "ms")
  } catch (ex) {
    console.log("FATAL ERROR: " + ex)
  }
}

main()

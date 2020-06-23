const fs = require("fs")

const { readRaw } = require("../utils/data")
const { resizeImage } = require("../utils/resizer")

async function processImages(directory, files) {
  try {
    const workers = []
    for (const file of files) {
      workers.push(
        resizeImage(
          file[1],
          [24, 24],
          `${directory}/${Date.now()}-${file[0]}-24x24.png`
        )
      )
      workers.push(
        resizeImage(
          file[1],
          [64, 64],
          `${directory}/${Date.now()}-${file[0]}-64x64.png`
        )
      )
    }

    await Promise.all(workers)
    return
  } catch (ex) {
    throw ex
  }
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

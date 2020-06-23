const { getRandomNumber } = require("../utils/math")

function upload(fileName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fileName)
    }, [getRandomNumber(1000, 5000)])
  })
}

const files = [
  "a.json",
  "b.json",
  "c.json",
  "d.json",
  "e.json",
  "f.json",
  "g.json",
  "h.json",
  "i.json",
  "j.json",
  "k.json",
  "l.json",
  "m.json",
]

/**
 * Process File Uploads synchronously
 */
async function processSync(files) {
  for (const file of files) {
    await upload(file)
    console.log(`Processed: ${file}`)
  }
}

/**
 * Process file asynchronosly but print in order of completion
 */
async function processAsync(files) {
  const completed = []

  const promises = files.map((file) =>
    upload(file).then(() => completed.push(file))
  )

  await Promise.all(promises)
  console.log("File Uploaded Completed: " + completed)
}

/** Process files asynchronosly using batching */
async function processAsyncWithBatches(files, batchSize) {
  let processed = 0
  while (processed < files.length) {
    const batch = []
    const completed = []
    for (let i = processed; i < processed + batchSize; i++) {
      batch.push(upload(files[i]).then(() => completed.push(files[i])))
    }

    await Promise.all(batch)
    console.log("Processed Batch: " + completed)
    processed += batch.length
  }
}

async function main() {
  await processSync(files)
  await processAsync(files)
  await processAsyncWithBatches(files, 4)
}

main()

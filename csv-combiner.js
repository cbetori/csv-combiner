const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
const Papa = require('papaparse')

const createWriteStream = (outputFile, waterMark) => {
  /*
    Purpose: Create write stream to limit memory usage

    Input: 
      outputFile - Name of file that is being written too
      waterMark - Amount of data stream can process at a given time

    Output: createWriteStream
    */
  return fs.createWriteStream(outputFile, 'utf8', {
    highWaterMark: waterMark,
    flags: 'w',
  })
}

const createReadStream = (inputFile, waterMark) => {
  /*
    Purpose: Create read stream to limit memory usage

    Input: 
      inputFile - Name of file that is being read
      waterMark - Amount of data stream can process at a given time

    Output: createReadStream
    */
  return fs.createReadStream(path.resolve(__dirname, inputFile), {
    highWaterMark: waterMark,
  })
}

class AddFileName extends Transform {
  /*
    Purpose: Allows us to modify data within stream. Adding filename is this case

    Input: 
      fileName - Name of file that will be appended to data
      headers - Boolean to determine if header should be removed from chunk

    Output: stream.Transform
    */
  constructor(fileName, headers) {
    super()
    this.fileName = fileName
    this.headers = headers
  }

  _transform(chunk, _, callback) {
    let data = chunk.toString()
    data = Papa.parse(data).data
    let parsedFileName = this.fileName.split('/')
    for (let i = 0; i < data.length - 1; i++) {
      if (i === 0 && this.headers === false) {
        data.splice(i, 1)
        continue
      }
      if (i === 0) {
        data[i].push('filename')
      } else {
        data[i].push(parsedFileName[parsedFileName.length - 1])
      }
    }
    data.map(e => e.push)
    data = Papa.unparse(data)
    this.push(data)
    callback()
  }
}

const handleCSVFiles = (outputFile, inputFiles) => {
  /*
    Purpose: Primary function that handles reading and creation of csv files.

    Input: 
      outputFile - Name of new file that will be created
      inputFiles - Array of file names that will be read 

    Output: n/a
    */
  console.log(outputFile)
  const waterMark = 10000000
  let writeStream
  if (outputFile === 'stdout') {
    writeStream = process.stdout
  } else {
    writeStream = createWriteStream(outputFile, waterMark)
  }
  for (let i = 0; i < inputFiles.length; i++) {
    let headers = i === 0 ? true : false
    const transform = new AddFileName(inputFiles[i], headers)
    createReadStream(inputFiles[i], waterMark).pipe(transform).pipe(writeStream)
  }
}

const main = () => {
  /*
    Purpose: Used to call primary function and provide command line args

    Input: n/a

    Output: n/a
    */
  const args = process.argv.slice(2)
  const outputFile = args.splice(args.length - 1, 1)[0]
  const inputFiles = args

  handleCSVFiles(outputFile, inputFiles)
}
main()
module.exports = { handleCSVFiles, main }

const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')
const { handleCSVFiles } = require('./csv-combiner.js')

const outputFile = 'combined_test.csv'

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const TestFileCreation = async () => {
  /*
    Purpose: Runs primary function in csv-combiner.js with test data
    and checks to make sure new file is created

    Output: true if file exists / false if file cannot be found
    */

  const inputFiles = fs
    .readdirSync(path.resolve(__dirname, 'fixtures_test'))
    .map(file => path.resolve(__dirname, 'fixtures_test', file))
  handleCSVFiles(outputFile, inputFiles)
  await wait(100)
  try {
    if (fs.existsSync(outputFile)) return true
  } catch (err) {
    return false
  }
}

const TestFileRowCount = async () => {
  /*
    Purpose: Used to compare length of new file and the 
    combined length of the files it was merged from

    Output: returns the length of newly created file
    */

  await wait(100)
  let data = fs.readFileSync(outputFile)
  data = data.toString()
  data = Papa.parse(data).data
  return data.length
}

const InputFileCount = () => {
  /*
    Purpose: Used to compare length of new file and the 
    combined length of the files it was merged from

    Output: returns combined length of original
    */
  const inputFiles = fs
    .readdirSync(path.resolve(__dirname, 'fixtures_test'))
    .map(file => path.resolve(__dirname, 'fixtures_test', file))

  let result = 0
  for (let i = 0; i < inputFiles.length; i++) {
    let data = fs.readFileSync(inputFiles[i])
    data = data.toString()
    data = Papa.parse(data).data
    result = result + data.length
  }
  //Backout extra headers minus the one header we used
  return result - inputFiles.length - 1
}

test('#1 Test that new file is created', () => {
  return expect(TestFileCreation()).resolves.toBe(true)
})

test('#2 Test that files has correct amount of rows', () => {
  return expect(TestFileRowCount()).resolves.toBe(InputFileCount())
})

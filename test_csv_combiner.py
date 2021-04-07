import unittest
from csv_combiner import filesReadWrite
import os.path as path
import glob

DIR = path.abspath(path.dirname(__file__))

def TestFileRowCount():
    """
    Purpose: Used to compare length of new file and the 
    combined length of the files it was merged from

    Output: returns the length of newly created file and combined length of input files
    """
    inputFiles = glob.glob(path.join(DIR,'', 'fixtures_test/*.csv'))
    outputFile = path.join(DIR,'','combined_test.csv')
    filesReadWrite(inputFiles, outputFile)
    inputFileCount = 0
    outPutFileCount = 0
    for file in inputFiles:
        with open(file) as f:
            inputFileCount = inputFileCount + (sum(1 for line in f))
    with open(outputFile) as f:
        outPutFileCount = outPutFileCount + (sum(1 for line in f))
    inputFileCount = inputFileCount - len(inputFiles)+1
    return {'inputValue': inputFileCount, 'outputValue': outPutFileCount}


class TestFileLength(unittest.TestCase):
    def test_File_Lengths(self):
        inputValue, outputValue = TestFileRowCount().values()
        self.assertEqual(inputValue, outputValue)
 

    
if __name__ == '__main__':
    
    unittest.main()
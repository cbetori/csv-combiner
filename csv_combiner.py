#!/usr/bin/env python3

import csv
import sys, getopt
import os.path as path

DIR = path.abspath(path.dirname(__file__))

def filesReadWrite(inputs, output):
    """
    Purpose: Crates and opens new file. Loops of input files and 
    reads files line be line to limit memory usage. Appends data from 
    input files. Then writes new data to newly created file

    Input: 
        inputs - list of file names that will be read
        output - name of file that will be created and written too

    Output: n/a
    """
    result = []
    with open(path.join(DIR,'', output), 'w', newline='') as file:
        if output == 'stdout':
            writer = csv.writer(sys.stdout)
        else:
             writer = csv.writer(file)
        for i, fileName in enumerate(inputs):
            parsedFileName = fileName.split('/')[-1]
            with open(path.join(DIR, '',fileName), newline='') as file:
                reader = csv.reader(file)
                for x, row in enumerate(reader):
                    if i > 0 and x == 0:
                        continue
                    if i == 0 and x == 0:
                        row.append('filename')
                        writer.writerow(row)
                        continue
                    row.append(parsedFileName)
                    writer.writerow(row)


def main(argv):
    """
    Purpose: Used to call primary function and provide command line args

    Input: n/a

    Output: n/a
    """
    opts, args = getopt.getopt(argv,"")
    inputs = args[1:len(args)-1]
    output = args[-1]

    filesReadWrite(inputs, output)
    

if __name__ == '__main__':
    main(sys.argv[0:])
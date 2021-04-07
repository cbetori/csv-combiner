package main

import (
	"encoding/csv"
	"io"
	"log"
	"os"
	"strings"
)

func fileReadWrite(file string, writer *csv.Writer, headers bool) {
	/*
		    Purpose: Creates read stream on file. Stream data is modified with file name. Data is written write stream

		    Input:
		      file - Path of file that will be read in read stream
			  writer - Write stream were data is written too
		      headers - Boolean to determine if header should be removed from chunk

		    Output:  n/a
	*/
	fileName := strings.Split(file, "/")
	recordCount := 0
	f, err := os.Open(file)
	if err != nil {
		log.Fatal(err)
	}
	r := csv.NewReader(f)
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		recordCount++
		if !headers && recordCount == 1 {
			continue
		}
		if recordCount == 1 {
			record = append(record, "filename")
			writer.Write(record)
		} else {
			record = append(record, fileName[len(fileName)-1])
			writer.Write(record)
		}

	}
	writer.Flush()
}

func handleCSVFiles(output string, input []string) {
	/*
		    Purpose: Primary function that handles reading and creation of csv files.
				Loops over input files and then calls func fileReadWrite

		    Input:
		      output - Name of new file that will be created
		      input - Slice of file names that will be read

		    Output: n/a
	*/
	path, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	var newFile *os.File
	var writer *csv.Writer
	if output == "stdout" {
		writer = csv.NewWriter(os.Stdout)
	} else {
		newFile, err := os.Create(path + "/" + output)
		if err != nil {
			log.Fatal(err)
		}
		writer = csv.NewWriter(newFile)
	}

	for i := range input {
		headers := false
		if i == 0 {
			headers = true
		}
		fileReadWrite(path+input[i][1:], writer, headers)
	}
	newFile.Close()
}

func main() {
	/*
	   Purpose: main function used to call primary function and provide command line args

	   Input: n/a

	   Output: n/a
	*/
	args := os.Args[1:]
	input := args[:len(args)-1]
	output := args[len(args)-1]

	handleCSVFiles(output, input)
}

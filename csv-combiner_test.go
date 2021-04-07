package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"testing"
)

func TestFileRowCount(t *testing.T) {
	/*
	   Purpose: Used to compare length of new file and the
	   combined length of the files it was merged from

	   Output: PASS if combined file and individul files are the same length else FAIL
	*/
	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	files, err := ioutil.ReadDir(path + "/fixtures_test")
	if err != nil {
		log.Println(err)
	}
	inputFiles := make([]string, 0)
	for _, f := range files {
		inputFiles = append(inputFiles, "//fixtures_test/"+f.Name())
	}

	outputFile := "combined_test.csv"

	handleCSVFiles(outputFile, inputFiles)

	inputCount := 0
	for i := range inputFiles {
		f, err := os.Open(path + inputFiles[i][1:])
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()
		r := csv.NewReader(f)
		for {
			_, err := r.Read()
			if err == io.EOF {
				break
			}
			inputCount++
		}
	}
	//We will have one header for the final output, remove extra headers from inputCount
	inputCount = inputCount - len(inputFiles) + 1
	f, err := os.Open(path + "/" + outputFile)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	r := csv.NewReader(f)
	outputCount := 0
	for {
		_, err := r.Read()
		if err == io.EOF {
			break
		}
		outputCount++
	}
	if inputCount != outputCount {
		fmt.Println("INPUT FILE LENGTH: " + strconv.Itoa(inputCount))
		fmt.Println("OUTPUT FILE LENGTH: " + strconv.Itoa(outputCount))
		t.Fail()
	}

}

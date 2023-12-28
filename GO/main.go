package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

type PathStruct struct {
	Path     string       `json:"path"`
	IsDir    bool         `json:"is_dir"`
	SubPaths []PathStruct `json:"sub_paths,omitempty"`
}

func ListFilesToJSON(directoryPath string) {
	// Get the list of files in the directory
	files, err := listFiles(directoryPath)
	if err != nil {
		// If there's an error, log and return
		log.Fatal(err)
	}

	// Save the file list to a JSON file
	err = saveToFile("file_list.json", files)
	if err != nil {
		// If there's an error saving to file, log and return
		log.Fatal(err)
	}

	fmt.Println("File created with success")
}

// listFiles returns a list of files in the specified directory
func listFiles(directoryPath string) ([]PathStruct, error) {
	var files []PathStruct

	dirEntries, err := os.ReadDir(directoryPath)
	if err != nil {
		return nil, err
	}

	for _, entry := range dirEntries {
		var pathStruct PathStruct
		absChildPath := filepath.Join(directoryPath, entry.Name())

		if entry.IsDir() {

			subFiles, err := listFiles(absChildPath)
			if err != nil {
				return nil, err
			}

			pathStruct.IsDir = true
			pathStruct.Path = absChildPath
			pathStruct.SubPaths = subFiles
		} else {
			pathStruct.IsDir = false
			pathStruct.Path = absChildPath
		}

		files = append(files, pathStruct)
	}

	return files, nil
}

// saveToFile saves data to a JSON file
func saveToFile(filename string, data []PathStruct) error {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	err = os.WriteFile(filename, jsonData, 0644)
	if err != nil {
		return err
	}

	return nil
}

func main() {
	directoryPath := "../"
	ListFilesToJSON(directoryPath)
}

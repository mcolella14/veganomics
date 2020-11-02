package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/graphql-go/graphql"
)

func main() {
	schema := initSchema()

	http.HandleFunc("/graphql", func(w http.ResponseWriter, r *http.Request) {
		var postBody GQLPost
		fmt.Printf("%v to /graphql\n", r.Method)
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if r.Method == "POST" {
			err := json.NewDecoder(r.Body).Decode(&postBody)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			variables := postBody.Variables

			result := executeQuery(postBody.Query, variables, schema)
			json.NewEncoder(w).Encode(result)
		}
	})

	fmt.Println("Now server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}

func executeQuery(query string, variables map[string]interface{}, schema graphql.Schema) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:         schema,
		RequestString:  query,
		VariableValues: variables,
	})
	if len(result.Errors) > 0 {
		fmt.Printf("wrong result, unexpected errors: %v", result.Errors[0].OriginalError())
	}
	return result
}

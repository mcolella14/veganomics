package main_test

import "testing"

func TestExecuteQuery(t *testing.T) {
	query := `
		query GetRestuarant($slug: String, $coordinates: CoordinatesInput){
		restaurant(slug: $slug, coordinates: $coordinates){
			name,
			slug,
			dishes {
				name,
				price,
				isVegan,
				isVeganAvailable,
				description
			},
			location {
			coordinates {
				latitude,
				longitude,
			},
			address
			},
			distance {
			text,
			value
			}
		}
		}
	`
	coordinates := Coordinates{
		Latitude:  10.2,
		Longitude: 20.3,
	}
	variables := map[string]interface{}{
		"slug":        "test-slug",
		"coordinates": coordinates,
	}
	schema := initSchema()
	result := executeQuery(query, variables, schema)
}

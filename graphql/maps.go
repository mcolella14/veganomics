package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"googlemaps.github.io/maps"
)

func getDistance(origin Coordinates, destination Coordinates) maps.Distance {
	c, err := maps.NewClient(maps.WithAPIKey(os.Getenv("GOOGLE_MAPS_DISTANCE_KEY")))
	if err != nil {
		log.Fatalf("fatal maps error: %s", err)
	}
	originString := fmt.Sprintf("%f,%f", origin.Latitude, origin.Longitude)
	destinationString := fmt.Sprintf("%f,%f", destination.Latitude, destination.Longitude)

	r := &maps.DistanceMatrixRequest{
		Origins:      []string{originString},
		Destinations: []string{destinationString},
		Units:        maps.UnitsImperial,
	}
	distanceResponse, err := c.DistanceMatrix(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	distance := distanceResponse.Rows[0].Elements[0].Distance
	return distance
}

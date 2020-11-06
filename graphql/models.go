package main

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"googlemaps.github.io/maps"
)

type Restaurant struct {
	Id             primitive.ObjectID `bson:"_id,omitempty"`
	Name           string             `bson:"name,omitempty"`
	Slug           string             `bson:"slug,omitempty`
	Dishes         []Dish             `bson:"dishes"`
	Location       Location           `bson:location, omitempty`
	TitleImage     string             `bson:"titleImage, omitempty"`
	Genres         []string           `bson:"genres, omitempty"`
	WebsiteUrl     string             `bson:"websiteUrl, omitempty"`
	OnlineOrdering OnlineOrdering     `bson:"onlineOrdering, omitempty"`
}

type RestaurantResponse struct {
	Id             primitive.ObjectID `bson:"_id,omitempty"`
	Name           string             `bson:"name,omitempty"`
	Slug           string             `bson:"slug,omitempty`
	Dishes         []Dish             `bson:"dishes"`
	Location       Location           `bson:location, omitempty`
	TitleImage     string             `bson:"titleImage, omitempty"`
	Distance       maps.Distance      `bson:"distance, omitempty"`
	Genres         []string           `bson:"genres, omitempty"`
	WebsiteUrl     string             `bson:"websiteUrl, omitempty"`
	OnlineOrdering OnlineOrdering     `bson:"onlineOrdering, omitempty"`
}

type Dish struct {
	Id               primitive.ObjectID `bson:"_id,omitempty"`
	Name             string             `bson:"name,omitempty"`
	Description      string             `bson:"description,omitempty"`
	IsVegan          bool               `bson:"isVegan,omitempty"`
	IsVeganAvailable bool               `bson:"isVeganAvailable,omitempty"`
	Price            float64            `bson:"price,omitempty"`
}

type Location struct {
	Address     string      `bson:"address, omitempty"`
	Coordinates Coordinates `bson:"coordinates, omitempty"`
}

type Coordinates struct {
	Latitude  float64 `bson:"latitude, omitempty"`
	Longitude float64 `bson:"longitude, omitempty"`
}

type GQLPost struct {
	OperationName string                 `bson:"operationName,omitempty"`
	Query         string                 `bson:"query,omitempty"`
	Variables     map[string]interface{} `bson:"variables,omitempty"`
}

type OnlineOrdering struct {
	DoorDash  string `bson:"doorDash, omitempty"`
	UberEats  string `bson:"uberEats, omitempty"`
	Postmates string `bson:"postmates, omitempty"`
}

type Filters struct {
	Genres []string `bson:"genres"`
}

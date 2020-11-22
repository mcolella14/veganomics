package main

import "github.com/graphql-go/graphql"

var onlineOrderingType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "OnlineOrdering",
		Fields: graphql.Fields{
			"doorDash": &graphql.Field{
				Type: graphql.String,
			},
			"uberEats": &graphql.Field{
				Type: graphql.String,
			},
			"postmates": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

var onlineOrderingInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "OnlineOrderingInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"doorDash": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"uberEats": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"postmates": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
		},
	},
)

var coordinatesType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Coordinates",
		Fields: graphql.Fields{
			"latitude": &graphql.Field{
				Type: graphql.Float,
			},
			"longitude": &graphql.Field{
				Type: graphql.Float,
			},
		},
	},
)

var coordinatesInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "CoordinatesInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"latitude": &graphql.InputObjectFieldConfig{
				Type: graphql.Float,
			},
			"longitude": &graphql.InputObjectFieldConfig{
				Type: graphql.Float,
			},
		},
	},
)

var locationType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Location",
		Fields: graphql.Fields{
			"address": &graphql.Field{
				Type: graphql.String,
			},
			"coordinates": &graphql.Field{
				Type: coordinatesType,
			},
		},
	},
)

var locationInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "LocationInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"address": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"coordinates": &graphql.InputObjectFieldConfig{
				Type: coordinatesInputType,
			},
		},
	},
)

var dishType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Dish",
		Fields: graphql.Fields{
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"isVegan": &graphql.Field{
				Type: graphql.Boolean,
			},
			"isVeganAvailable": &graphql.Field{
				Type: graphql.Boolean,
			},
			"price": &graphql.Field{
				Type: graphql.Float,
			},
		},
	},
)

var dishInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "DishInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"isVegan": &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
			"isVeganAvailable": &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
			"price": &graphql.InputObjectFieldConfig{
				Type: graphql.Float,
			},
		},
	},
)

var dishGroupType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "DishGroup",
		Fields: graphql.Fields{
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"dishes": &graphql.Field{
				Type: graphql.NewList(dishType),
			},
		},
	},
)

var dishGroupInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "DishGroupInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"dishes": &graphql.InputObjectFieldConfig{
				Type: graphql.NewList(dishInputType),
			},
		},
	},
)

var restaurantType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Restaurant",
		Fields: graphql.Fields{
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"slug": &graphql.Field{
				Type: graphql.String,
			},
			"dishGroups": &graphql.Field{
				Type: graphql.NewList(dishGroupType),
			},
			"location": &graphql.Field{
				Type: locationType,
			},
			"titleImage": &graphql.Field{
				Type: graphql.String,
			},
			"genres": &graphql.Field{
				Type: graphql.NewList(graphql.String),
			},
			"distance": &graphql.Field{
				Type: distanceType,
			},
			"websiteUrl": &graphql.Field{
				Type: graphql.String,
			},
			"onlineOrdering": &graphql.Field{
				Type: onlineOrderingType,
			},
			"allVegan": &graphql.Field{
				Type: graphql.Boolean,
			},
		},
	},
)

var restaurantInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "RestaurantInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"slug": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"dishGroups": &graphql.InputObjectFieldConfig{
				Type: graphql.NewList(dishGroupInputType),
			},
			"location": &graphql.InputObjectFieldConfig{
				Type: locationInputType,
			},
			"titleImage": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"genres": &graphql.InputObjectFieldConfig{
				Type: graphql.NewList(graphql.String),
			},
			"websiteUrl": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"onlineOrdering": &graphql.InputObjectFieldConfig{
				Type: onlineOrderingInputType,
			},
			"allVegan": &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
		},
	},
)

var distanceType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Distance",
		Fields: graphql.Fields{
			"text": &graphql.Field{
				Type: graphql.String,
			},
			"value": &graphql.Field{
				Type: graphql.Int,
			},
		},
	},
)

var filtersInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "FiltersInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"genres": &graphql.InputObjectFieldConfig{
				Type: graphql.NewList(graphql.String),
			},
		},
	},
)

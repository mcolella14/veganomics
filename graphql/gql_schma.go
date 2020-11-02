package main

import (
	"fmt"
	"log"
	"sort"

	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/mongo"
)

func initSchema() graphql.Schema {
	fields := restaurantInputType.Fields()
	fieldNames := []string{}
	//valueMapFieldNames := []string{}

	for fieldName := range fields {
		fieldNames = append(fieldNames, fieldName)
	}
	sort.Strings(fieldNames)

	// for fieldName := range valueMap {
	// 	valueMapFieldNames = append(valueMapFieldNames, fieldName)
	// }
	// sort.Strings(valueMapFieldNames)

	queryFields := graphql.Fields{
		"restaurant": &graphql.Field{
			Type:        graphql.NewList(restaurantType),
			Description: "Get Restaurant List",
			Args: graphql.FieldConfigArgument{
				"slug": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"coordinates": &graphql.ArgumentConfig{
					Type: coordinatesInputType,
				},
			},
			Resolve: restaurantQueryResolver,
		},
	}
	mutationFields := graphql.Fields{
		"createRestaurant": &graphql.Field{
			Type: restaurantType,
			Args: graphql.FieldConfigArgument{
				"restaurant": &graphql.ArgumentConfig{
					Type: restaurantInputType,
				},
			},
			Resolve: restaurantMutationResolver,
		},
		"createDish": &graphql.Field{
			Type: restaurantType,
			Args: graphql.FieldConfigArgument{
				"dish": &graphql.ArgumentConfig{
					Type: dishInputType,
				},
				"restSlug": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: dishMutationResolver,
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: queryFields}
	rootMutation := graphql.ObjectConfig{Name: "RootMutation", Fields: mutationFields}
	schemaConfig := graphql.SchemaConfig{
		Query:    graphql.NewObject(rootQuery),
		Mutation: graphql.NewObject(rootMutation),
	}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("Failed to creat GraphQL Schema %v", err)
	}
	return schema
}

func restaurantQueryResolver(p graphql.ResolveParams) (interface{}, error) {
	coordinatesArg, ok2 := p.Args["coordinates"]
	fmt.Println(p.Args)
	if slug, ok := p.Args["slug"]; ok {
		var coordinates Coordinates
		mapstructure.Decode(coordinatesArg, &coordinates)
		if ok2 {
			restaurant := getRestaurantByName(slug.(string))
			fmt.Printf("restaurant is %v \n", restaurant)
			distance := getDistance(coordinates, restaurant[0].Location.Coordinates)
			restaurant[0].Distance = distance
			fmt.Println(distance)
			return restaurant, nil
		}
		log.Fatal("Need to have coordinates as a parameter")

	}
	if ok2 {
		var restaurantsToReturn []RestaurantResponse
		var coordinates Coordinates
		mapstructure.Decode(coordinatesArg, &coordinates)
		for _, rest := range getAllRestaurants() {
			var returnRest RestaurantResponse
			mapstructure.Decode(rest, &returnRest)
			distance := getDistance(coordinates, rest.Location.Coordinates)
			returnRest.Distance = distance
			restaurantsToReturn = append(restaurantsToReturn, returnRest)
		}
		fmt.Println(restaurantsToReturn)
		return restaurantsToReturn, nil
	}
	return getAllRestaurants(), nil
}

func restaurantMutationResolver(p graphql.ResolveParams) (interface{}, error) {
	restaurant, ok := p.Args["restaurant"]
	if ok {
		var restaurantToInsert Restaurant
		mapstructure.Decode(restaurant, &restaurantToInsert)
		returnedRestaurant, err := insertRestaurant(restaurantToInsert)
		err2, ok := err.(mongo.WriteException)
		fmt.Printf("%T\n", err)
		fmt.Printf("%T\n", err2)
		fmt.Println(ok)
		if ok {
			fmt.Printf("%v\n", err2.WriteErrors[0].Message)
			fmt.Printf("%v\n", err2.WriteErrors[0].Code)
			fmt.Printf("%v\n", err2.WriteErrors[0].Index)
		}
		if err != nil {
			switch myErr := err.(type) {
			case mongo.WriteException:
				mongoError := myErr.WriteErrors[0]
				if mongoError.Code == 11000 {
					return nil, errors.New(fmt.Sprintf("%s already exists on the site!", restaurantToInsert.Name))
				}
				return nil, errors.New("Sorry, something went wrong /:")
			default:
				return nil, errors.New("Sorry, something went wrong /:")
			}
		}
		return returnedRestaurant, nil
	}
	log.Fatal("Need to have restaurant as a paramater")
	return nil, nil
}

func dishMutationResolver(p graphql.ResolveParams) (interface{}, error) {
	dish, ok := p.Args["dish"]
	if !ok {
		log.Fatal("Need to have dish as a paramater")
	}
	restSlug, ok2 := p.Args["restSlug"]
	if !ok2 {
		log.Fatal("Need to have restSlug as a paramater")
	}
	var dishToInsert Dish
	mapstructure.Decode(dish, &dishToInsert)
	returnedRestaurant := insertDish(dishToInsert, restSlug.(string))
	return returnedRestaurant, nil
}

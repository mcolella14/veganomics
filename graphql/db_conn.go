package main

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func insertRestaurants(restaurants []Restaurant) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_CONN_STR")))
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := client.Database("veganomics").Collection("restaurants")

	var restaurantsInterfaces []interface{}
	for _, rest := range restaurants {
		restaurantsInterfaces = append(restaurantsInterfaces, rest)
	}
	_, err2 := collection.InsertMany(ctx, restaurantsInterfaces)
	if err2 != nil {
		log.Fatal(err)
	}
}

func getRestaurantByName(slug string) []RestaurantResponse {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_CONN_STR")))
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()
	collection := client.Database("veganomics").Collection("restaurants")

	var restaurants []RestaurantResponse

	filter := bson.M{"slug": slug}
	opts := options.Find()
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		log.Fatal(err)
	}
	if err2 := cursor.All(ctx, &restaurants); err2 != nil {
		log.Fatal(err2)
	}

	return restaurants
}

func getAllRestaurants(filters Filters) []Restaurant {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_CONN_STR")))
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()
	collection := client.Database("veganomics").Collection("restaurants")

	var restaurants []Restaurant
	filterBson := bson.M{}
	if len(filters.Genres) > 0 {
		filterBson["genres"] = bson.M{"$in": filters.Genres}
	}
	opts := options.Find()
	cursor, err2 := collection.Find(ctx, filterBson, opts)
	if err2 != nil {
		log.Fatal(err2)
	}
	if err3 := cursor.All(ctx, &restaurants); err3 != nil {
		log.Fatal(err3)
	}

	return restaurants
}

func insertRestaurant(restaurant Restaurant) (*Restaurant, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_CONN_STR")))
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()
	collection := client.Database("veganomics").Collection("restaurants")
	insertResult, err2 := collection.InsertOne(ctx, restaurant)
	if err2 != nil {
		return nil, err2
	} else {
	}

	insertedID := insertResult.InsertedID
	filter := bson.M{"_id": insertedID}
	opts := options.FindOne()
	findResult := collection.FindOne(ctx, filter, opts)

	var returnRestaurant Restaurant

	findResult.Decode(&returnRestaurant)
	return &returnRestaurant, nil
}

func insertDish(dish Dish, slug string) Restaurant {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_CONN_STR")))
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()
	collection := client.Database("veganomics").Collection("restaurants")

	opts := options.FindOneAndUpdate()
	filter := bson.M{"slug": slug}
	update := bson.D{{"$push", bson.D{{"dishes", dish}}}}

	var returnRestaurant Restaurant
	err2 := collection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&returnRestaurant)

	if err2 != nil {
		log.Fatal(err2)
	}
	return returnRestaurant
}

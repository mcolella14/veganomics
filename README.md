# Veganomics

This app is designed to provide information about vegan-friendly restaurants and their vegan-friendly options.

## API Keys

### Google Maps
Note that there is a `keys.json` file included in the `.gitignore`. This file should contain an object with the key `googleMaps`, which has a valid Google Maps API Key. See https://developers.google.com/maps/documentation/javascript/get-api-key for instructions on obtaining a key.

The graphql server has an environment variable named `GOOGLE_MAPS_DISTANCE_KEY`. This also must be a valid Google Maps API key, which utilizes the Distance Matrix API.

You must enable the Places, Distance Matrix, and Maps Javascript APIs in the GCP Project associated with your keys.

## MongoDB
The graphql server has an environment variable named `MONGODB_CONN_STR`, which points to a MongoDB instance containing a collection of restaurants.
import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from "@vis.gl/react-google-maps";
import MapHandler from "./MapHandler";
import PlaceAutocomplete from "./PlaceAutocomplete";
import { Button, Spinner } from "react-bootstrap";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

function App() {
  const [start, setStart] = useState<google.maps.places.PlaceResult | null>(
    null
  );
  const [destination, setDestination] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);

  const onCalculateDistance = () => {
    console.log("Calculating distance");
    // Make API call here

    if (start && destination) {
      setLoading(true);
      setDistance(null);

      // Make API call here
      const addresses = {
        addr1: start.formatted_address,
        addr2: destination.formatted_address,
      };

      // Define the URL of your Rails API endpoint
      const url = "/api/distcalc";

      // Make the POST request
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses }),
      })
        .then((response) => response.json())
        .then((data) => {
          setDistance(data.dist);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="App">
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={{ lat: 39.8097343, lng: -98.5556199 }}
          defaultZoom={5}
          minZoom={2.5}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          <MapControl position={ControlPosition.RIGHT_TOP}>
            <div className="p-2 m-2 bg-white rounded">
              <PlaceAutocomplete onPlaceSelect={setStart} placeholder="Start" />
              <PlaceAutocomplete
                onPlaceSelect={setDestination}
                placeholder="Destination"
              />
              <Button
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={onCalculateDistance}
              >
                Calculate Distance
              </Button>
              {distance && (
                <div className="p-2 m-2 bg-white rounded">
                  <h4>Distance</h4>
                  <p>{distance}</p>
                </div>
              )}
              {Loading && (
                <div>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>
          </MapControl>
          <MapHandler start={start} destination={destination} />
        </Map>
      </APIProvider>
    </div>
  );
}

export default App;

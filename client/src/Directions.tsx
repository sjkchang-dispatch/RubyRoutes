import React, { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

type DirectionsProps = {
  start: google.maps.places.PlaceResult | null;
  destination: google.maps.places.PlaceResult | null;
};

const Directions = (props: DirectionsProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map, props.start, props.destination]);

  // Use directions service
  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !props.start?.formatted_address ||
      !props.destination?.formatted_address
    )
      return;

    directionsService
      .route({
        origin: props.start.formatted_address,
        destination: props.destination.formatted_address,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, props.start, props.destination]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(0);
  }, [directionsRenderer]);

  return <div className="directions"></div>;
};

export default Directions;

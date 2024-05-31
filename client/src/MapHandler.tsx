import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";

interface Props {
  start: google.maps.places.PlaceResult | null;
  destination: google.maps.places.PlaceResult | null;
}

const MapHandler = ({ start, destination }: Props) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  // Fit map to start and destination
  useEffect(() => {
    // If the map, start, or destination is not available, return
    if (!map || (!start && !destination)) return;

    // If the start has a viewport but the destination does not, fit the map to the start viewport
    if (start?.geometry?.viewport && !destination?.geometry?.viewport) {
      map.fitBounds(start.geometry?.viewport);
    }

    // If the destination has a viewport but the start does not, fit the map to the destination viewport
    if (destination?.geometry?.viewport && !start?.geometry?.viewport) {
      map.fitBounds(destination.geometry?.viewport);
    }

    // If the start and destination have a viewport, fit the map to their average viewport
    if (start?.geometry?.viewport && destination?.geometry?.viewport) {
      const bounds = new google.maps.LatLngBounds();
      bounds.union(start.geometry.viewport);
      bounds.union(destination.geometry.viewport);
      map.fitBounds(bounds);
    }
  }, [map, start, destination]);

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map, start, destination]);

  // Use directions service
  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !start?.formatted_address ||
      !destination?.formatted_address
    )
      return;

    directionsService
      .route({
        origin: start.formatted_address,
        destination: destination.formatted_address,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, start, destination]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(0);
  }, [directionsRenderer]);

  return null;
};

export default React.memo(MapHandler);

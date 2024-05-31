import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";

interface Props {
  start: google.maps.places.PlaceResult | null;
  destination: google.maps.places.PlaceResult | null;
}

const MapHandler = ({ start, destination }: Props) => {
  const map = useMap();

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

  return null;
};

export default React.memo(MapHandler);

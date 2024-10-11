/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const libraries = ["places"];

const MapWithDirections = ({ currentLocation, animalLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    loading: "async",
  });
  const customMarker = {
    path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
    fillColor: "red",
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  };
  console.log(currentLocation);
  console.log(animalLocation);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const calculateRoute = useCallback(async () => {
    if (!currentLocation || !animalLocation) return;

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: currentLocation,
        destination: animalLocation,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }, [currentLocation, animalLocation]);

  useEffect(() => {
    if (currentLocation && animalLocation) {
      calculateRoute();
    }
  }, [currentLocation, animalLocation, calculateRoute]);

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={currentLocation}
      >
        {currentLocation && (
          <Marker icon={customMarker} position={currentLocation} />
        )}
        {animalLocation && <Marker position={animalLocation} />}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      {distance && duration && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#3acf50",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>Distance:</strong> {distance}
          </p>
          <p>
            <strong>Duration:</strong> {duration}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapWithDirections;

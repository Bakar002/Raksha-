/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const libraries = ["places"];

function AnimalLocator({ ngoLocation, animalLocation, status }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    loading: "async",
  });

  const [center, setCenter] = useState(animalLocation || defaultCenter);
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  async function calculateRoute() {
    if (!ngoLocation || !animalLocation) {
      console.error("Both NGO location and animal location must be provided.");
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: ngoLocation,
      destination: animalLocation,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  // Handle map load
  const onMapLoad = useCallback(
    async (map) => {
      mapRef.current = map;
      mapInstanceRef.current = map; // Set the map instance for panTo

      if (animalLocation) {
        setCenter(animalLocation);
      }

      if (status === "New") {
        await calculateRoute();
      }
    },
    [ngoLocation, animalLocation, status]
  );

  useEffect(() => {
    if (animalLocation) {
      setCenter(animalLocation);
    }
  }, [animalLocation]);

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <div style={{ position: "relative" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          onLoad={onMapLoad}
        >
          {ngoLocation && status === "New" && (
            <MarkerF
              key="ngoMarker"
              position={ngoLocation}
              label={{
                text: "NGO Location",
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />
          )}
          {animalLocation && (
            <MarkerF
              key="animalMarker"
              position={animalLocation}
              label={{
                text: "Animal Location",
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />
          )}

          {directionsResponse && status === "New" && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      {status === "New" && (
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
          {distance && duration && (
            <>
              <p>
                <strong>Distance:</strong> {distance}
              </p>
              <p>
                <strong>Duration:</strong> {duration}
              </p>
            </>
          )}
        </div>
      )}
      {animalLocation && status !== "New" && (
        <p className="fw-bold" style={{ marginTop: "1rem" }}>
          Location of case: {animalLocation.lat.toFixed(5)},{" "}
          {animalLocation.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}

export default AnimalLocator;

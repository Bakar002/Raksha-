/* eslint-disable react/prop-types */
import { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import { GpsFixedOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

function LocationSelector({ onSelectLocation, initialLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Ensure this is set
    libraries,
  });

  const [selected, setSelected] = useState(initialLocation || null);
  const [center, setCenter] = useState(
    initialLocation || { lat: -34.397, lng: 150.644 }
  );
  const mapRef = useRef(null); // Reference to the Google Map instance
  const mapInstanceRef = useRef(null); // Reference to the Google Map instance for panTo
  const autocompleteRef = useRef(null); // Reference to the Autocomplete instance
  const [lat, setLat] = useState(initialLocation?.lat || "");
  const [lng, setLng] = useState(initialLocation?.lng || "");

  // Handle map clicks to update the selected location
  const onMapClick = useCallback(
    (event) => {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelected(location);
      onSelectLocation(location);
    },
    [onSelectLocation]
  );

  // Handle map load
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      mapInstanceRef.current = map; // Set the map instance for panTo
      if (initialLocation) {
        map.panTo(initialLocation);
      }
    },
    [initialLocation]
  );

  // Get current location using Geolocation API if no initial location is provided
  useEffect(() => {
    if (!selected && !initialLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCenter(currentLocation);
            setSelected(currentLocation);
            onSelectLocation(currentLocation);
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [selected, initialLocation]);

  // Handle panTo center when icon is clicked
  const handlePanToCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(selected || center);
    } else {
      console.error("Map instance is not available.");
    }
  };

  // Handle place selection from the search box
  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();

    if (place.geometry && place.geometry.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenter(location);
      setSelected(location);
      onSelectLocation(location);
      mapInstanceRef.current.panTo(location);
    } else {
      console.error("No geometry found for the selected place.");
    }
  };

  // Handle latitude and longitude input
  const handleLatLngSubmit = () => {
    if (lat && lng) {
      const location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setCenter(location);
      setSelected(location);
      onSelectLocation(location);
      mapInstanceRef.current.panTo(location);
    }
  };

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="d-flex flex-column gap-400">
      <div className="">
        <p>Search By place</p>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceSelected}
        >
          <input type="text" placeholder="Search Place name..." />
        </Autocomplete>
      </div>

      <div>
        <p>Search By lat and lng</p>
        <div className="d-flex flex-wrap gap-400">
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
          <Button
            onClick={handleLatLngSubmit}
            style={{
              padding: "5px 10px",
              borderRadius: "3px",
              border: "none",
              backgroundColor: "#088602",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go
          </Button>
        </div>
      </div>
      <div>
        <p>Or Mark the location on Google map</p>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={selected || center}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{ mapId: "ebc91f1d10dbaf3e" }}
        >
          {selected && <MarkerF position={selected} />}
        </GoogleMap>
      </div>

      {selected && (
        <div className="d-flex justify-between">
          <p>
            Selected Location: {selected?.lat?.toFixed(5)},{" "}
            {selected?.lng?.toFixed(5)}
          </p>
          <GpsFixedOutlined onClick={handlePanToCenter} />
        </div>
      )}
    </div>
  );
}

export default LocationSelector;

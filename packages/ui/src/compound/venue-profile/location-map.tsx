"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api"
import { Input } from "../../base/input.js"
import { Button } from "../../base/button.js"
import { MapPin, Search } from "lucide-react"

const libraries: ("places")[] = ["places"]

interface LocationMapProps {
  apiKey: string
  address?: string
  coordinates?: { lat?: number; lng?: number }
  onAddressChange?: (address: string) => void
  onCoordinatesChange?: (coordinates: { lat: number; lng: number }) => void
  readonly?: boolean
  height?: string
}

const defaultCenter = { lat: 48.8566, lng: 2.3522 } // Paris default

export function LocationMap({
  apiKey,
  address: initialAddress,
  coordinates: initialCoordinates,
  onAddressChange,
  onCoordinatesChange,
  readonly = false,
  height = "400px",
}: LocationMapProps) {
  const [address, setAddress] = useState(initialAddress || "")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialCoordinates?.lat && initialCoordinates?.lng
      ? { lat: initialCoordinates.lat, lng: initialCoordinates.lng }
      : null
  )
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    coordinates || defaultCenter
  )
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
    libraries,
  })

  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [isLoaded])

  useEffect(() => {
    if (initialAddress !== undefined) {
      setAddress(initialAddress)
    }
  }, [initialAddress])

  useEffect(() => {
    if (initialCoordinates?.lat && initialCoordinates?.lng) {
      const newCoords = { lat: initialCoordinates.lat, lng: initialCoordinates.lng }
      setCoordinates(newCoords)
      setMapCenter(newCoords)
    }
  }, [initialCoordinates])

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onAutocompleteLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance)
  }, [])

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const newCoordinates = { lat, lng }
        const newAddress = place.formatted_address || address

        setCoordinates(newCoordinates)
        setMapCenter(newCoordinates)
        setAddress(newAddress)
        onAddressChange?.(newAddress)
        onCoordinatesChange?.(newCoordinates)

        if (map) {
          map.setCenter(newCoordinates)
          map.setZoom(15)
        }
      }
    }
  }, [autocomplete, map, address, onAddressChange, onCoordinatesChange])

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (readonly || !e.latLng) return

      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      const newCoordinates = { lat, lng }

      setCoordinates(newCoordinates)
      setMapCenter(newCoordinates)
      onCoordinatesChange?.(newCoordinates)

      // Reverse geocode to get address
      if (geocoderRef.current) {
        geocoderRef.current.geocode({ location: newCoordinates }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address
            setAddress(newAddress)
            onAddressChange?.(newAddress)
          }
        })
      }
    },
    [readonly, onAddressChange, onCoordinatesChange]
  )

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const handleSearchClick = () => {
    if (!address.trim() || !geocoderRef.current) return

    geocoderRef.current.geocode({ address: address.trim() }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        const newCoordinates = { lat, lng }

        setCoordinates(newCoordinates)
        setMapCenter(newCoordinates)
        onCoordinatesChange?.(newCoordinates)
        onAddressChange?.(results[0].formatted_address)

        if (map) {
          map.setCenter(newCoordinates)
          map.setZoom(15)
        }
      }
    })
  }

  if (loadError) {
    const errorMessage =
      loadError.message?.includes("ApiProjectMapError") ||
      loadError.message?.includes("api-project-map-error")
        ? "Google Maps API error: Please ensure your API key is valid and the Maps JavaScript API is enabled in your Google Cloud project."
        : loadError.message || "Error loading Google Maps. Please check your API key configuration.";

    return (
      <div className="flex flex-col items-center justify-center border rounded-lg p-8 gap-2" style={{ height }}>
        <p className="text-destructive font-medium">Error loading Google Maps</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">{errorMessage}</p>
        {!apiKey && (
          <p className="text-xs text-muted-foreground mt-2">
            API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.
          </p>
        )}
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center border rounded-lg p-8 gap-2" style={{ height }}>
        <p className="text-muted-foreground font-medium">Google Maps API key not configured</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable to enable map functionality.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center border rounded-lg p-8" style={{ height }}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!readonly && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                types: ["address"],
              }}
            >
              <div className="relative flex-1">
                <Input
                  ref={addressInputRef}
                  type="text"
                  placeholder="Search for an address or click on the map"
                  value={address}
                  onChange={handleAddressInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSearchClick()
                    }
                  }}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </Autocomplete>
            <Button type="button" onClick={handleSearchClick} variant="outline">
              Search
            </Button>
          </div>
        </div>
      )}

      {readonly && address && (
        <div className="text-sm text-muted-foreground">
          <p>{address}</p>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={coordinates ? 15 : 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {coordinates && <Marker position={coordinates} />}
        </GoogleMap>
      </div>

      {coordinates && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  )
}


import React from "react";
import appConfig from "../../config/app.json";

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapEditBike = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${appConfig.google_map_api_key}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: "100%" }} />,
        containerElement: <div style={{ height: "400px" }} />,
        mapElement: <div style={{ height: "100%" }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {};

            this.setState({
                bounds: null,
                center: {
                    lat: 41.9, lng: -87.624
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    });
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new window.google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                    }));

                    var filtered_array = places[0].address_components.filter(function(address_component){
                        return address_component.types.includes("country");
                    }); 
          
                    var countryName = filtered_array.length ? filtered_array[0].long_name: "";
                    var countryCode = filtered_array.length ? filtered_array[0].short_name: "";

                    const nextCenter = _.get(nextMarkers, "0.position", this.state.center);

                    this.props.handleChangeState({
                        address: {
                            name: places[0].formatted_address,
                            country: {
                                name: countryName,
                                code: countryCode,
                            },
                            long: nextCenter.lng(),
                            lat: nextCenter.lat()
                        }
                    });

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);
                },
            });
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        defaultCenter={{lat: props.bikeInfo.location.lat, lng: props.bikeInfo.location.long}}
        onBoundsChanged={props.onBoundsChanged}
    >
        <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                value={props.bikeInfo.location.name}
                placeholder="Customized your placeholder"
                style={{
                    boxSizing: "border-box",
                    border: "1px solid transparent",
                    width: "240px",
                    height: "32px",
                    marginTop: "27px",
                    padding: "0 12px",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                    fontSize: "14px",
                    outline: "none",
                    textOverflow: "ellipses",
                }}
            />
        </SearchBox>
        {
            props.markers.length != 0 ?
                props.markers.map((marker, index) =>
                    <Marker key={index} position={marker.position} />
                ) :
                <Marker position={{lat: props.bikeInfo.location.lat, lng: props.bikeInfo.location.long}} />
        }
    </GoogleMap>
);

export default MapEditBike;
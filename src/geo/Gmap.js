import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

const ApiKey = "AIzaSyDdtB13gdB0BmgUvvbRe8K4_gv8n3g56aw";

const AsyncGoogleMapConst = withScriptjs(
    withGoogleMap(
        props => (
            <GoogleMap
                ref={props.onMapLoad}
                defaultZoom={14}
                defaultCenter={{ lat: -27.467464, lng: 153.025035 }}
            >
                {props.markers.map(marker => (
                    <Marker
                        key={marker.key}
                        position={marker.position}
                        onClick={() => props.onMarkerClick(marker)}
                    >
                        {marker.showInfo && (
                            <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                                {marker.infoContent}
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
            </GoogleMap>
        )
    )
);

class GoogleMapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: []
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleMarkerClose = this.handleMarkerClose.bind(this);
    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            const addresses = this.props.addresses;
            let markers = [];
            for (let i = 0; i < addresses.length; i++) {
                markers.push({
                    position: {
                        lat: addresses[i]["latitude"],
                        lng: addresses[i]["longitude"],
                    },
                    showInfo: false,
                    infoContent: (
                        <div className="panel panel-info">
                            <div className="panel-heading"><h3 className="panel-title">{addresses[i]["name"]}</h3></div>
                            <div className="panel-body"><span className="glyphicon glyphicon-home"></span>&nbsp;{addresses[i]["address"]}</div>
                        </div>
                    ),
                    defaultAnimation: 2,
                    key: addresses[i]["name"]
                })
            }

            this.setState({
                markers: markers,
            });
        }
    }

    handleMarkerClick(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: true,
                    };
                }
                return marker;
            }),
        });
    }

    handleMarkerClose(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: false,
                    };
                }
                return marker;
            }),
        });
    }

    render() {
        return (
            <div className="map">
                <AsyncGoogleMapConst
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + ApiKey}
                    loadingElement={
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    }
                    containerElement={
                        <div style={{ height: `100%` }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                    onMapLoad={this.handleMapLoad}
                    onMarkerClick={this.handleMarkerClick}
                    onMarkerClose={this.handleMarkerClose}
                    markers={this.state.markers}
                />
            </div>
        );
    }
}

export default GoogleMapContainer;
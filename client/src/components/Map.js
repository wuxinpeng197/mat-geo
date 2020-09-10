import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import PinIcon from './PinIcon';
import Context from "../context";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import Blog from "./Blog";
import differenceInMinutes from 'date-fns/difference_in_minutes';
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations"
import { useClient } from "../client";
import { Subscription } from "react-apollo";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
} from "../graphql/subscriptions";


const initialViewport = { 
  latitude: -35.8523,
  longtitude: 155.2108,
  zoom: 13
}

const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const [viewport, setViewport] = useState(initialViewport)
  const [userPosition, setUserPosition] = useState(null)
  const [pop, setPop] = useState(null)
  const { state, dispatch } = useContext(Context)
  const client = useClient()

  useEffect(() => {
    getUserPosition()  
  }, [])

  const getPin = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    dispatch({type: "GET_PINS", payload: getPins})
  }

  useEffect(() => {
    getPin()
  }, [])

  useEffect(() => {
    getPin()
    dispatch({type:"UPDATE_PIN_STATUS"})
  }, [state.hasNew])

  useEffect(() => {
    getPin()
  }, [state.pins])

  const getUserPosition = () =>{
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({...viewport, latitude, longitude})
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const handleMapClick = ({lngLat, leftButton}) => {
    console.log(state)
    if (!leftButton){
      return
    }
    if(!state.draft){
      dispatch({type: "CREATE_DRAFT"})
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {latitude, longitude}
    })
    
  }

  const highlightNewPin = (pin) => {
    let isNewPin = differenceInMinutes(Date.now(), Number(pin.createAt)) <= 30;
    return isNewPin ? "green" : "darkblue"
  }
  
  const handleSelectPin = (pin) => { 
    setPop(pin)
    dispatch({ type:"SET_PIN", payload: pin})
  }

  const isAuthUser = () => {
    return state.currentUser.me._id === pop.author._id
  }

  const handleDeletePin = async (pin) => {
    const variety ={pinId: pin._id}
    await client.request(DELETE_PIN_MUTATION, variety)
    setPop(null)
  }
  
  return (
  <div className={mobileSize ? classes.rootMobile : classes.root}>
    <ReactMapGL
    width="100vw"
    height="calc(100vh - 64px)"
    mapStyle="mapbox://styles/mapbox/streets-v10"
    mapboxApiAccessToken="pk.eyJ1Ijoid3V4aW4zIiwiYSI6ImNrZWtybTBmNjF1NmMyeG52cGkyY2hibjkifQ.gLAZ0MKjlRsWxdkFcFrqnA"
    onViewStateChange={newviewport => setViewport(newviewport)}
    onClick={handleMapClick}
    {...viewport}
    >
    <div className={classes.navigationControl}>
      <NavigationControl
        onViewportChange={newviewport => setViewport(newviewport)}
      />
    </div>

    {userPosition && (
      <Marker
       latitude={userPosition.latitude}
       longitude={userPosition.longitude}
       offsetLeft={-19}
       offsetTop={-37}
      >
        <PinIcon 
        size={40} 
        color="pink"
        />
      </Marker>
    )}

    {state.draft && (
      <Marker
       latitude={state.draft.latitude}
       longitude={state.draft.longitude}
       offsetLeft={-18}
       offsetTop={-37}
      >
        <PinIcon size={40} color="red"/>
      </Marker>
      )}

    {state.pins.map(pin => (
        <Marker
        key={pin._id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        offsetLeft={-18}
        offsetTop={-37}
       >
         <PinIcon size={40} onClick={() => handleSelectPin(pin)} color={highlightNewPin(pin)}/>
       </Marker>
      ))}

      {pop && (
        <Popup
        anchor="top"
        latitude={pop.latitude}
        longitude={pop.longitude}
        closeOnClick={true}
        onClick={() => setPop(null)}
        >
          <img
          className={classes.popupImage}
          src={pop.image}
          alt={pop.title}
          />
          <div className={classes.popupTab}>
            <Typography>
              {pop.latitude}, {pop.longitude}
            </Typography>
            {isAuthUser() && (
              <Button onClick={() => handleDeletePin(pop)}>
                 <DeleteIcon className={classes.deleteIcon}/>
              </Button>
              )}
          </div>
        </Popup>
      )}

    </ReactMapGL>

     {/* Subscriptions for Creating / Updating / Deleting Pins */}
     <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log('oin',pinAdded);
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log('asdasd',pinUpdated);
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log('asdasd',{ pinDeleted });
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
        }}
      />

    <Blog />
  </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);

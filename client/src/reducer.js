export default function reducer(state, { payload, type }) {
    switch(type) {
        case "GET_PINS":
            return {
                ...state,
                pins: payload
            }
        case "LOGIN_USER":
            return {
                ...state,
                currentUser: payload
            }
        case "SET_PIN":
            return {
                ...state,
                currentPin: payload,
                draft: null
            }
        case "DELETE_PIN":
            const deletedPin = payload
            const filterPin = state.pins.filter( pin => pin._id !== deletedPin._Id)
            return {
                    ...state,
                    pins: filterPin,
                    currentPin: null
            }
        case "IS_LOGGED_IN":
            return {
                    ...state,
                    isAuth: payload
                }    
        case "CREATE_PIN":
            return {
                ...state,
                hasNew: true
            }
        case "UPDATE_PIN_STATUS":
            return {
                ...state,
                hasNew: false
            }
        case "SIGNOUT_USER":
            return {
                ...state,
                currentUser: null,
                isAuth: false
            }
        case "CREATE_DRAFT":
            return {
                ...state,
                pin: null,
                draft: {
                    latitude: 0,
                    longitude: 0,
                }
            }
        case "UPDATE_DRAFT_LOCATION":
            return {
                ...state,
                draft: payload
            }
        case "DELETE_DRAFT":
            return {
                ...state,
                draft: null
            }
        case "CREATE_COMMENT":
                    const updatedCurrentPin = payload;
                    const updatedPins = state.pins.map(pin =>
                    pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
                  );
                  return {
                    ...state,
                    pins: updatedPins,
                    currentPin: updatedCurrentPin
                      };
        default: 
            return state;
    }
}
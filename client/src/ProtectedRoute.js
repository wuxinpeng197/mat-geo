import React, { useContext } from "react"
import Context from "./context";
import { Route, Redirect } from "react-router-dom";


export const ProtectedRoute = ({component: Component, ...rest}, props) => {
    const {state} = useContext(Context);
    return (
    <Route render={props => 
        !state.isAuth ? <Redirect to='/login' /> : <Component/>} {...rest} />
    )
}
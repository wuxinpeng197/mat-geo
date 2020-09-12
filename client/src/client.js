import { useState, useEffect } from "react"
import { GraphQLClient } from "graphql-request";

export const BASE_URL =  process.env.NODE_ENV === "production"
? "https://matthew-geo.herokuapp.com/"
: "http://localhost:4000/graphql";

export const useClient = () => {
    const [ idToken, setToken ] = useState()    
    useEffect(() => {
        const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
        setToken(idToken)
    }, [])

    return new GraphQLClient(BASE_URL, {
        headers: {authorization: idToken}
    })
}
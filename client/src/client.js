import { useState, useEffect } from "react"
import { GraphQLClient } from "graphql-request";

export const BASE_URL = "https://matthew-geo.herokuapp.com/graphql" 

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
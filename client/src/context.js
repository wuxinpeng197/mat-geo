import { createContext } from 'react'

const Context = createContext({
    currentUser: null,
    isAuth: false,
    draft: null,
    pins: [],
    hasNew: false,
    currentPin: null
})


export default Context
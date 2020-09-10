const { gql } = require('apollo-server');


module.exports = gql`
    type User {
        _id: ID
        name: String
        email: String
        picture: String
    }
    
    type Pin {
        _id: ID
        createAt: String
        title: String
        content: String
        image: String
        latitude: Float
        longitude: Float
        author: User
        comments: [Comment]
    }
    
    type Comment {
        text: String
        createAt: String
        author: User
    }

    type Query {
        me: User
        getPins: [Pin!]
    }

    input CreatePinInput {
        title: String
        image: String
        content: String
        latitude: Float
        longitude: Float
    }

    type Mutation {
        createPin (input: CreatePinInput!): Pin
        deletePin(pinId: ID!): Pin
        createComment(pinId: ID!, text: String!): Pin
    }

    type Subscription {
        pinAdded: Pin
        pinDeleted: Pin
        pinUpdated: Pin
      }
`
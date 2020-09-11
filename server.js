const { ApolloServer} =  require('apollo-server');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose =  require('mongoose');
require('dotenv').config()
const { findOrCreateUser } = require('./controllers/User') 

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:
true})
.then(() => console.log('db connected'))
.catch(err => console.log(err));

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null
        let currentUser = null
        try{
            authToken = req.headers.authorization
            if(authToken){
                currentUser = await findOrCreateUser(authToken)
            }
            return { currentUser }
        } catch (err){
            console.error('unable to authenticate')
        }
    
    }
  });

  // Initialize the app
const app = express();
app.use(cors())
app.use(express.static('client/build'))
app.use(bodyParser.urlencoded({extended:true}));

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
// DEFAULT 
if( process.env.NODE_ENV === 'production' ){
    const path = require('path');
    app.get('/*',(req,res)=>{
        res.sendfile(path.resolve(__dirname,'./client','build','index.html'))
    })
}

app.listen(({ port: process.env.PORT || 4000 }), () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  });



// const server  = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: async ({ req }) => {
//         let authToken = null
//         let currentUser = null
//         try{
//             authToken = req.headers.authorization
//             if(authToken){
//                 currentUser = await findOrCreateUser(authToken)
//             }
//             return { currentUser }
//         } catch (err){
//             console.error('unable to authenticate')
//         }
    
//     }
// });

// server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
//     console.log(`server listening on ${url}`)
// });
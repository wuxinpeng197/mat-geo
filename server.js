const { ApolloServer} =  require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose =  require('mongoose');
require('dotenv').config()
const { findOrCreateUser } = require('./controllers/User') 
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:
true})
.then(() => console.log('db connected'))
.catch(err => console.log(err));

const server  = new ApolloServer({
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

server.listen().then(({url}) => {
    console.log(`server listening on ${url}`)
});
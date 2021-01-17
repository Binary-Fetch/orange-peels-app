const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require("jsonwebtoken")

const UserAPI = require('./datasources/user');
const CocktailAPI = require('./datasources/cocktail');

const apolloServer = new ApolloServer({
    context: async ({ req }) => {
        //simple auth chech on every request
        const auth = (req.headers && req.headers.authorization) || '';
        let email = ""
        let token = ""
        let username = ""
        let accessToken = "f3123b20-8a8e-4fe8-b411-f67df9bfa4f7"
        const getToken = () => {
            return auth.split(" ")[1]
        }
        if (auth.length && auth.split(" ")[1]) {
            token = getToken()
        }
        if (token !== "") {
            //Config for check token
            username = jwt.verify(token, "secret_key").username
            console.log(username)
            email = jwt.verify(token, "secret_key").email
            let user = {
                username: username,
                email: email,
                accessToken: accessToken
            }
            return user;
        }
        if (token === "") {
            let accessTokenDetails = {
                accessToken: accessToken
            }
            return accessTokenDetails;
        }
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        cocktailAPI: new CocktailAPI(),
        userAPI: new UserAPI()
    })
});

module.exports = apolloServer;

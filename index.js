const { ApolloServer } = require("apollo-server")
const jwt = require("jsonwebtoken")
require("dotenv").config(".env")

const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")

const connectDB = require("./config/db")


connectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || ""
    if (token) {
      try {
        const userToken = token.replace("Bearer ", "")
        const user = jwt.verify(userToken, process.env.SECRET)
        return { user }
      } catch (error) {
        console.log("Error on context from server: ", error)
      }
    }
  }
})

server.listen().then(({ url }) => console.log(`Server ready in ${url}`))
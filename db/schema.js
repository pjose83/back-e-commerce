const { gql } = require("apollo-server")

const typeDefs = gql`
  type token {
    token: String
  }

  type card {
    number: String
    id: ID
  }

  type Query {
    getCard: [card]
  }

  input userInput {
    name: String!
    email: String!
    password: String!
  }

  input authInput {
    email: String!
    password: String!
  }

  input cardInput {
    number: String!
  }

  type Mutation {
    createUser(input: userInput): String
    authUser(input: authInput): token
    newCard(input: cardInput): card
    deleteCard(id: ID!): String
  }
`

module.exports = typeDefs
const User = require("../models/User")
const Card = require("../models/Card")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: ".env" })

//Create a JWT
const createToken = (user, secret, expiresIn) => {
  const { id, email } = user

  return jwt.sign({ id, email }, secret, { expiresIn })
}

const resolvers = {
  Query: {
    getCard: async (_, {}, context) => {
      try {
        const card = await Card.find({ owner: context.user.id })
        return card
      } catch (error) {
        console.log("Error on getCard: ", error)
      }
    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { email, password } = input

      //Confirm if is unique email
      const userExist = await User.findOne({ email })

      if (userExist) throw new Error("The email is already in use")

      try {
        //Hasing password
        const salt = await bcryptjs.genSalt(10)
        input.password = await bcryptjs.hash(password, salt)

        //Register user
        const newUser = new User(input)
        newUser.save()
        return "User created successfully"
      } catch (error) {
        console.log("Error on createUser: ", error);
      }
    },

    authUser: async (_, { input }) => {
      const { email, password } = input

      //Confirm user
      const userExist = await User.findOne({ email })

      if (!userExist) throw new Error("Invalid email")

      //Confirm password
      const confirmedPassword = await bcryptjs.compare(password, userExist.password)

      if (!confirmedPassword) throw new Error("Invalid password")

      //Give access
      return {
        token: createToken(userExist, process.env.SECRET, "2hr")
      }
    },

    newCard: async (_, { input }, context) => {
      try {
        const card = new Card(input)

        //asociate owner
        card.owner = context.user.id

        //Save in DB
        const savedCard = await card.save()
        return savedCard
      } catch (error) {
        console.log("Error on newCard: ", error)
      }
    },

    deleteCard: async (_, { id }, context) => {
      try {
        //Check if the card exist
        const card = await Card.findById(id)

        if (!card) throw new Error("Card wasn't found")

        //Check if the user is the owner
        if (card.owner.toString() !== context.owner.id) throw new Error("You don't have the credentials to delete this card")

        //Delete card
        await Card.findOneAndDelete({ _id: id })
        return "Card deleted"
      } catch (error) {
        console.log("Error on deleteCard: ", error)
      }
    }
  }
}

module.exports = resolvers
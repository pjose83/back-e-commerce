const mongoose = require("mongoose")
require("dotenv").config({ path: ".env" })

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      // useUnidifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true
    })
    console.log("DB connected");
  } catch (error) {
    console.log("Error con connectDB: ", error)
    process.exit(1)
  }
}

module.exports = connectDB
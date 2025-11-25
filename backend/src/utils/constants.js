require('dotenv').config({ path: '.env' })

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET
const MONGO_URL = process.env.MONGO_URL
module.exports = {
    JWT_SECRET,
    PORT,
    MONGO_URL
}
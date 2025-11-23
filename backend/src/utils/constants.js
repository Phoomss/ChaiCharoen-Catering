require('dotenv').config({ path: '.env' })

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    JWT_SECRET,
    PORT
}
FROM node:18-alpine

# Install build dependencies if needed (e.g., for bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Create uploads directories
RUN mkdir -p uploads/menu-images uploads/payment-slips

EXPOSE 8080

CMD ["npm", "start"]

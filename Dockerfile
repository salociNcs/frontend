# Use the official Node.js 14 image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy application code.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application.
CMD ["npm", "run", "dev"]

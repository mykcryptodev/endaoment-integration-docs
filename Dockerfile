FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY quickstart/frontend/package.json ./quickstart/frontend/
COPY quickstart/backend/package.json ./quickstart/backend/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build both frontend and backend
RUN cd quickstart/frontend && yarn build
RUN cd quickstart/backend && yarn tsc --pretty

# Install serve to serve the frontend
RUN yarn global add serve

# Create a script to run both services
RUN echo '#!/bin/sh\n\
# Print environment variables for debugging\n\
echo "Environment variables:"\n\
env\n\
\n\
# Start the frontend\n\
serve -s quickstart/frontend/dist -l 3000 &\n\
\n\
# Start the backend\n\
node quickstart/backend/dist/index.js' > /app/start.sh && chmod +x /app/start.sh

# Expose both ports
EXPOSE 3000 5454

# Start both services
CMD ["/app/start.sh"] 
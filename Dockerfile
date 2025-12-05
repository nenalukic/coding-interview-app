FROM node:18-alpine

WORKDIR /app

# Copy root package.json and install concurrently
COPY package.json ./
RUN npm install

# Copy server and install
COPY server/package.json server/
RUN npm install --prefix server

# Copy client and install
COPY client/package.json client/
RUN npm install --prefix client

# Copy source code
COPY . .

# Build client
RUN npm run build --prefix client

# Expose ports (3000 for server, client is served statically or via separate dev server if needed, 
# but for production typically server serves client static files)
EXPOSE 3000

# Start command
CMD ["npm", "run", "start"]

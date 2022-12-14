FROM --platform=linux/amd64 node:16

# Install linux packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    nano \
    tree && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root group and user
RUN adduser --gecos "" --disabled-password -u 10001 app

# Switch to the user's home directory
WORKDIR /home/app

# Set the $HOME environment variable (to avoid permission issues during "npm install")
ENV HOME /home/app

# Set the environment to production
ENV NODE_ENV production

# Copy the package into the Docker image
COPY package.json package-lock.json ./

# Install the node modules
RUN npm install --production

# Include the PSQL_URI as a build arg
ARG PSQL_URI
ENV PSQL_URI=${PSQL_URI}

# Copy the rest of the source code
COPY dist/ dist/

# Expose the API port (optional)
EXPOSE 5050

# Switch to the non-root user
USER app

CMD ["node", "dist/index.js"]

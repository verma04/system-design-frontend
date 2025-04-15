FROM node:20.14-alpine as base

# Install necessary dependencies
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Install corepack (for managing pnpm version) and turbo globally via pnpm (instead of yarn)
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g turbo

# Expose port
EXPOSE 4000

# Copy package.json and pnpm-lock.yaml first for better cache utilization
COPY package.json pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm i --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Set the project-specific environment variable
ARG PROJECT
ENV PROJECT=$PROJECT

# Print the project value (for debugging)
RUN echo "Starting project: $PROJECT"

# Define the command to run based on PROJECT value
CMD if [ -z "$PROJECT" ]; then \
      echo "No project specified. Starting default server."; \
      pnpm run dev; \
    else \
      pnpm run dev:"$PROJECT"; \
    fi

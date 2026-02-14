FROM gcc:12-alpine

# Create unprivileged user for sandboxing
RUN adduser -D -u 1000 -h /sandbox sandbox

# Install minimal required packages
RUN apk add --no-cache \
    libstdc++

# Set working directory
WORKDIR /sandbox

# Switch to unprivileged user
USER sandbox

# Default command (will be overridden)
CMD ["g++"]

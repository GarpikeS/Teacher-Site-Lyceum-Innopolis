FROM alpine:3.19

# Create unprivileged user for sandboxing
RUN adduser -D -u 1000 -h /sandbox sandbox

# Install GCC and C++ support
RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    libstdc++

# Set working directory
WORKDIR /sandbox

# Switch to unprivileged user
USER sandbox

# Default command (will be overridden)
CMD ["g++"]

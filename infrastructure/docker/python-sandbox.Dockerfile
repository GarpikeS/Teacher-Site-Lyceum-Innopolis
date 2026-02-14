FROM python:3.11-alpine

# Create unprivileged user for sandboxing
RUN adduser -D -u 1000 -h /sandbox sandbox

# Install minimal required packages
RUN apk add --no-cache \
    gcc \
    musl-dev

# Set working directory
WORKDIR /sandbox

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONHASHSEED=random \
    PYTHONPATH=/sandbox

# Switch to unprivileged user
USER sandbox

# Default command (will be overridden)
CMD ["python3"]

# Update base image to 1.25 to match your go.mod requirement
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server/main.go

# --- Final Stage ---
FROM alpine:latest

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/server .

# Install CA certificates (needed for Firebase HTTPS)
RUN apk --no-cache add ca-certificates

# Expose port 8080
EXPOSE 8080

# Command to run
CMD ["./server"]
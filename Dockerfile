FROM golang:1.22-alpine

# Install required packages
RUN apk add --no-cache \
    gcc \
    g++ \
    make \
    pkgconfig \
    gtk+3.0-dev \
    webkit2gtk-dev \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Copy Go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Install Wails
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Build the application
WORKDIR /app
RUN wails build

# The built application will be in /app/build/bin/
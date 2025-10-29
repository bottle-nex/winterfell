FROM ubuntu:24.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install necessary packages
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    ca-certificates \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Node.js 20.x LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN npm install -g yarn

# Install Solana CLI only (skip Anchor for now)
ENV SOLANA_INSTALL_INIT_SKIP_ANCHOR=true
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

# Add Solana to PATH
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI using cargo (builds from source, avoids GLIBC issues)
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install latest && avm use latest

# Add AVM to PATH
ENV PATH="/root/.avm/bin:${PATH}"

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]




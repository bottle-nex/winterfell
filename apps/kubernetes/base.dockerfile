FROM rust:alpine

# Install all dependencies
RUN apk add --no-cache \
    curl \
    git \
    build-base \
    musl-dev \
    openssl-dev \
    pkg-config

# Install Anchor and Solana CLI
RUN cargo install anchor-cli solana-cli

# Install Rust Analyzer
RUN rustup component add rust-analyzer

WORKDIR /workspace

CMD ["/bin/sh", "-c", "tail -f /dev/null"]
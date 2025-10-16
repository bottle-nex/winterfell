FROM rust:alpine

RUN apk add --no-cache \
    curl \
    git \
    build-base \
    musl-dev \
    openssl-dev \
    pkg-config

RUN cargo install anchor-cli solana-cli

RUN rustup component add rust-analyzer

WORKDIR /workspace

CMD ["/bin/sh", "-c", "tail -f /dev/null"]
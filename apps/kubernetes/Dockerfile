FROM rust:alpine

# Update package index and use main mirror
RUN apk update && apk add --no-cache \
    curl \
    git \
    build-base \
    musl-dev \
    openssl-dev \
    pkgconf

RUN cargo install anchor-cli solana-cli

RUN rustup component add rust-analyzer

WORKDIR /workspace

CMD ["/bin/sh", "-c", "tail -f /dev/null"]
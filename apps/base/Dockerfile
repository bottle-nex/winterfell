FROM rust:1.78-slim-bookworm

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    git \
    jq \
    tree \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Install Solana from pre-built binary
RUN curl -sSfL https://github.com/solana-labs/solana/releases/download/v1.18.22/solana-release-x86_64-unknown-linux-gnu.tar.bz2 -o /tmp/solana.tar.bz2 && \
    tar jxf /tmp/solana.tar.bz2 -C /tmp && \
    mkdir -p /usr/local/solana && \
    mv /tmp/solana-release/bin /usr/local/solana/ && \
    rm -rf /tmp/solana* && \
    ln -s /usr/local/solana/bin/* /usr/local/bin/

# Verify Solana
RUN solana --version

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --locked

# Copy mount-code script
COPY scripts/mount-code.sh /usr/local/bin/mount-code
RUN chmod +x /usr/local/bin/mount-code

# Setup Solana config
WORKDIR /workspace
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase -o /root/.config/solana/id.json -s && \
    solana config set --url localhost

ENV ANCHOR_WALLET="/root/.config/solana/id.json"

# Final verification
RUN solana --version && anchor --version

CMD ["/bin/bash"]
# Lightweight Anchor development image - minimal overhead
FROM --platform=linux/amd64 debian:bookworm-slim

# Install only essential dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (minimal, no docs)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.78.0 --profile minimal
ENV PATH="/root/.cargo/bin:$PATH"

# Install Solana CLI
RUN bash -c 'curl -sSfL https://release.solana.com/v1.18.22/install | sh' || \
    bash -c 'curl -sSfL https://release.solana.com/stable/install | sh'
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor CLI (just the binary, no extra tools)
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --locked

# Minimal config
WORKDIR /workspace
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase -o /root/.config/solana/id.json -s && \
    solana config set --url localhost

ENV ANCHOR_WALLET="/root/.config/solana/id.json"

# Verify
RUN solana --version && anchor --version

CMD ["/bin/bash"]
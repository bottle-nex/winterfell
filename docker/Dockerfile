FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# System Dependencies
RUN apt-get update && apt-get install -y \
    curl wget git ca-certificates pkg-config \
    build-essential libssl-dev libudev-dev \
    python3 clang llvm lld unzip \
    && rm -rf /var/lib/apt/lists/*

# Solana Install (CORRECTED — no Markdown link)
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Rust (required before installing AVM/Anchor)
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install AVM
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked
ENV PATH="/root/.avm/bin:${PATH}"

# Install Anchor
RUN avm install latest && avm use latest

# Node.js + Yarn (Required by Anchor)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    npm install -g yarn

# Toolchain Verification
RUN rustc --version && \
    cargo --version && \
    solana --version && \
    anchor --version && \
    node --version && \
    yarn --version

# Workspace
WORKDIR /workspace

CMD ["/bin/bash"]

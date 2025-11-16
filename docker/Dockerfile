FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl wget ca-certificates build-essential \
    pkg-config libssl-dev libudev-dev git \
    && rm -rf /var/lib/apt/lists/*

# Install everything and extract the actual paths in ONE layer
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash && \
    # Source the configs to get the environment
    . ~/.bashrc && \
    . ~/.profile && \
    # Verify everything works
    echo "=== Verifying installations ===" && \
    rustc --version && \
    cargo --version && \
    solana --version && \
    anchor --version && \
    node --version && \
    yarn --version && \
    echo "=== All tools verified ===" && \
    # Extract the actual PATH that works
    echo "Working PATH: $PATH"

# Set the environment based on standard installation locations
ENV PATH="/root/.avm/bin:/root/.cargo/bin:/root/.local/share/solana/install/active_release/bin:${PATH}"

# Create an entrypoint that sources the environment
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo '. ~/.bashrc 2>/dev/null || true' >> /entrypoint.sh && \
    echo '. ~/.profile 2>/dev/null || true' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Pre-cache dependencies (source environment first)
RUN . ~/.bashrc && \
    . ~/.profile && \
    mkdir -p /tmp/dummy && \
    cd /tmp/dummy && \
    anchor init dummy --no-git && \
    cd dummy && \
    anchor build && \
    rm -rf /tmp/dummy

ENV CARGO_HOME=/root/.cargo
WORKDIR /workspace

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/bash"]
# Makefile - Automates Docker image build, test, and deployment tasks
# Instead of typing long docker commands, you just type: make build, make push, etc.

# Configuration variables
REGISTRY ?= ghcr.io/yourusername
IMAGE_NAME = anchor-base
TAG ?= latest
FULL_IMAGE = $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Default target (runs when you just type 'make')
.DEFAULT_GOAL := help

# Check if mount-code.sh exists before building
check-mount-script:
	@if [ ! -f scripts/mount-code.sh ]; then \
		echo "❌ Error: scripts/mount-code.sh not found!"; \
		echo "The Dockerfile expects scripts/mount-code.sh in the build context."; \
		echo "Please create mount-code.sh in the scripts/ directory."; \
		exit 1; \
	fi
	@echo "✅ scripts/mount-code.sh found"

# Build the Docker image
build: check-mount-script
	@echo "🔨 Building optimized Anchor base image..."
	@echo "Image: $(FULL_IMAGE)"
	DOCKER_BUILDKIT=1 docker build \
		--build-arg BUILDKIT_INLINE_CACHE=1 \
		--cache-from $(FULL_IMAGE) \
		-t $(FULL_IMAGE) \
		-t $(IMAGE_NAME):latest \
		-f Dockerfile \
		.
	@echo "✅ Build complete!"
	@echo ""
	@docker images $(IMAGE_NAME):latest

# Build without using cache (clean build)
build-no-cache: check-mount-script
	@echo "🔨 Building without cache (fresh build)..."
	DOCKER_BUILDKIT=1 docker build --no-cache -t $(FULL_IMAGE) -t $(IMAGE_NAME):latest .
	@echo "✅ Build complete!"

# Push image to container registry
push: build
	@echo "📤 Pushing to registry..."
	docker push $(FULL_IMAGE)
	@echo "✅ Pushed: $(FULL_IMAGE)"

# Test the image with a sample Anchor project
test: build
	@echo "🧪 Testing image with sample Anchor project..."
	@mkdir -p test-workspace
	@echo '{"name":"test-project","type":"FOLDER","children":[{"name":"programs","type":"FOLDER","children":[{"name":"test-project","type":"FOLDER","children":[{"name":"src","type":"FOLDER","children":[{"name":"lib.rs","type":"FILE","content":"use anchor_lang::prelude::*;\\n\\ndeclare_id!(\\\"Fg6PaFpoGXkYsidMpWxTWKd8HZqKWVYaRoFsFfTKHHyD\\\");\\n\\n#[program]\\nmod test_program {\\n    use super::*;\\n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\\n        Ok(())\\n    }\\n}\\n\\n#[derive(Accounts)]\\npub struct Initialize {}"}]}]}]},{"name":"Anchor.toml","type":"FILE","content":"[toolchain]\\n\\n[features]\\nseeds = false\\nskip-lint = false\\n\\n[programs.localnet]\\ntest_project = \\\"Fg6PaFpoGXkYsidMpWxTWKd8HZqKWVYaRoFsFfTKHHyD\\\"\\n\\n[registry]\\nurl = \\\"https://api.apr.dev\\\"\\n\\n[provider]\\ncluster = \\\"Localnet\\\"\\nwallet = \\\"~/.config/solana/id.json\\\"\\n\\n[scripts]\\ntest = \\\"yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts\\\""}]}' > test-workspace/filetree.json
	@echo ""
	@echo "🔍 Testing mount-code script..."
	docker run --rm \
		-v $(PWD)/test-workspace:/mnt/test \
		$(IMAGE_NAME):latest \
		/bin/bash -c "mount-code /mnt/test/filetree.json /workspace && echo '✅ Files mounted successfully!' && ls -la /workspace && find /workspace -type f"
	@echo ""
	@echo "✅ Test passed!"

# Quick test - just mount code without full Anchor build
test-mount: build
	@echo "🧪 Testing code mounting..."
	@mkdir -p test-workspace
	@echo '{"name":"hello.txt","type":"FILE","content":"Hello from FileNode!\\nThis is line 2\\nAnd line 3"}' > test-workspace/simple.json
	docker run --rm \
		-v $(PWD)/test-workspace:/mnt/test \
		$(IMAGE_NAME):latest \
		/bin/bash -c "mount-code /mnt/test/simple.json /workspace && echo '--- File Contents ---' && cat /workspace/hello.txt && echo '' && echo '✅ Mount test passed!'"

# Test healthcheck
healthcheck: build
	@echo "🏥 Running healthcheck..."
	docker run --rm $(IMAGE_NAME):latest healthcheck
	@echo "✅ Healthcheck passed!"

# Show image size breakdown
size: build
	@echo "📊 Image size breakdown:"
	@docker images $(IMAGE_NAME):latest
	@echo ""
	@echo "Layer sizes:"
	@docker history --human --format "table {{.Size}}\t{{.CreatedBy}}" $(IMAGE_NAME):latest | head -20

# Open interactive shell in container
shell: build
	@echo "🐚 Opening shell in container..."
	@echo "Tip: Try running 'healthcheck' or 'anchor --version' inside the container"
	docker run --rm -it \
		-v $(PWD)/workspace:/workspace \
		$(IMAGE_NAME):latest \
		/bin/bash

# Clean up images and containers
clean:
	@echo "🧹 Cleaning up..."
	docker rmi $(FULL_IMAGE) $(IMAGE_NAME):latest || true
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Remove test files
clean-test:
	@echo "🧹 Cleaning test files..."
	rm -rf test-workspace/
	@echo "✅ Test files cleaned!"

# Full clean (images + test files)
clean-all: clean clean-test
	@echo "✅ Full cleanup complete!"

# Tag image with custom tag
tag: build
	@read -p "Enter new tag: " NEW_TAG; \
	docker tag $(IMAGE_NAME):latest $(REGISTRY)/$(IMAGE_NAME):$$NEW_TAG; \
	echo "✅ Tagged as: $(REGISTRY)/$(IMAGE_NAME):$$NEW_TAG"

# Pull latest image from registry
pull:
	@echo "📥 Pulling from registry..."
	docker pull $(FULL_IMAGE)
	@echo "✅ Pulled: $(FULL_IMAGE)"

# Login to registry (for GitHub Container Registry)
login:
	@echo "🔐 Logging into container registry..."
	@echo "For GitHub: docker login ghcr.io -u USERNAME"
	@read -p "Continue with Docker login? (y/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker login $(REGISTRY); \
	fi

# Show all available scripts in the image
scripts: build
	@echo "📜 Available scripts in image:"
	@docker run --rm $(IMAGE_NAME):latest ls -lh /usr/local/bin/ | grep -E "(mount-code|anchor-|healthcheck)"

# Run full integration test
test-full: build
	@echo "🧪 Running full integration test..."
	@echo "This will test: mount-code, anchor build, and healthcheck"
	@mkdir -p test-workspace
	@echo '{"name":"hello.rs","type":"FILE","content":"// Test file\\nfn main() {\\n    println!(\\\"Hello!\\\");\\n}"}' > test-workspace/test.json
	@docker run --rm -v $(PWD)/test-workspace:/mnt/test $(IMAGE_NAME):latest /bin/bash -c "\
		echo '1️⃣ Testing healthcheck...' && healthcheck && echo '' && \
		echo '2️⃣ Testing mount-code...' && mount-code /mnt/test/test.json /test && cat /test/hello.rs && echo '' && \
		echo '3️⃣ Testing Anchor CLI...' && anchor --version && echo '' && \
		echo '4️⃣ Testing Solana CLI...' && solana --version && echo '' && \
		echo '✅ All tests passed!'"
	@echo ""
	@echo "✅ Full integration test complete!"

# Show help
help:
	@echo "🚀 Anchor Base Image - Makefile Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  build          - Build Docker image (checks for mount-code.sh)"
	@echo "  build-no-cache - Build without using cache"
	@echo "  push           - Build and push to registry"
	@echo "  pull           - Pull latest from registry"
	@echo "  login          - Login to container registry"
	@echo ""
	@echo "Testing:"
	@echo "  test           - Test with sample Anchor project"
	@echo "  test-mount     - Quick test of FileNode mounting"
	@echo "  test-full      - Full integration test"
	@echo "  healthcheck    - Run healthcheck inside container"
	@echo ""
	@echo "Development:"
	@echo "  shell          - Open interactive shell in container"
	@echo "  scripts        - Show available scripts in image"
	@echo "  size           - Show image size breakdown"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean          - Remove built images"
	@echo "  clean-test     - Remove test files"
	@echo "  clean-all      - Remove images and test files"
	@echo "  tag            - Tag image with custom version"
	@echo ""
	@echo "Variables:"
	@echo "  REGISTRY       - Container registry (default: ghcr.io/yourusername)"
	@echo "  TAG            - Image tag (default: latest)"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make test-full"
	@echo "  make push REGISTRY=ghcr.io/yourname TAG=v1.0.0"
	@echo "  make shell"
	@echo ""
	@echo "⚠️  Important: Make sure scripts/mount-code.sh exists before building!"

# Declare phony targets (not actual files)
.PHONY: build build-no-cache push test test-mount test-full healthcheck size shell \
        clean clean-test clean-all tag pull login scripts help check-mount-script
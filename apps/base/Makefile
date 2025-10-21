# Makefile - Automates Docker image build, test, and deployment tasks
# Instead of typing long docker commands, you just type: make build, make push, etc.

# Configuration variables
REGISTRY ?= your-registry.io
IMAGE_NAME = anchor-base
TAG ?= latest
FULL_IMAGE = $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Default target (runs when you just type 'make')
.DEFAULT_GOAL := help

# Build the Docker image
build:
	@echo "🔨 Building optimized Anchor base image..."
	@echo "Image: $(FULL_IMAGE)"
	docker build \
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
build-no-cache:
	@echo "🔨 Building without cache (fresh build)..."
	docker build --no-cache -t $(FULL_IMAGE) -t $(IMAGE_NAME):latest .
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
	@echo '{"name":"test-project","type":"FOLDER","children":[{"name":"src","type":"FOLDER","children":[{"name":"lib.rs","type":"FILE","content":"use anchor_lang::prelude::*;\n\ndeclare_id!(\"Fg6PaFpoGXkYsidMpWxTWKd8HZqKWVYaRoFsFfTKHHyD\");\n\n#[program]\nmod test_program {\n    use super::*;\n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize {}"}]}]}' > test-workspace/filetree.json
	docker run --rm \
		-v $(PWD)/test-workspace:/mnt/test \
		$(IMAGE_NAME):latest \
		/bin/bash -c "mount-code /mnt/test/filetree.json /workspace && ls -la /workspace && cat /workspace/src/lib.rs"
	@echo "✅ Test passed!"

# Quick test - just mount code without full Anchor build
test-mount:
	@echo "🧪 Testing code mounting..."
	@mkdir -p test-workspace
	@echo '{"name":"hello.txt","type":"FILE","content":"Hello from FileNode!"}' > test-workspace/simple.json
	docker run --rm \
		-v $(PWD)/test-workspace:/mnt/test \
		$(IMAGE_NAME):latest \
		/bin/bash -c "mount-code /mnt/test/simple.json /workspace && cat /workspace/hello.txt"

# Show image size breakdown
size: build
	@echo "📊 Image size breakdown:"
	@docker images $(IMAGE_NAME):latest
	@echo ""
	@echo "Layer sizes:"
	@docker history --human --format "table {{.Size}}\t{{.CreatedBy}}" $(IMAGE_NAME):latest | head -15

# Open interactive shell in container
shell:
	@echo "🐚 Opening shell in container..."
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

# Tag image with custom tag
tag:
	@read -p "Enter new tag: " NEW_TAG; \
	docker tag $(IMAGE_NAME):latest $(REGISTRY)/$(IMAGE_NAME):$$NEW_TAG; \
	echo "✅ Tagged as: $(REGISTRY)/$(IMAGE_NAME):$$NEW_TAG"

# Pull latest image from registry
pull:
	@echo "📥 Pulling from registry..."
	docker pull $(FULL_IMAGE)
	@echo "✅ Pulled: $(FULL_IMAGE)"

# Show help
help:
	@echo "🚀 Anchor Base Image - Makefile Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build          - Build Docker image (default: latest tag)"
	@echo "  build-no-cache - Build without using cache"
	@echo "  push           - Build and push to registry"
	@echo "  test           - Test image with sample project"
	@echo "  test-mount     - Quick test of FileNode mounting"
	@echo "  size           - Show image size breakdown"
	@echo "  shell          - Open interactive shell in container"
	@echo "  clean          - Remove built images"
	@echo "  clean-test     - Remove test files"
	@echo "  tag            - Tag image with custom version"
	@echo "  pull           - Pull latest from registry"
	@echo "  help           - Show this help message"
	@echo ""
	@echo "Variables:"
	@echo "  REGISTRY       - Container registry (default: your-registry.io)"
	@echo "  TAG            - Image tag (default: latest)"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make push REGISTRY=ghcr.io/yourname TAG=v1.0.0"
	@echo "  make test"

# Declare phony targets (not actual files)
.PHONY: build build-no-cache push test test-mount size shell clean clean-test tag pull help
#!/bin/bash
# mount-code.sh - Converts FileNode JSON to actual filesystem structure

set -e

# Input: JSON file path or stdin
INPUT_JSON="${1:-/dev/stdin}"
WORKSPACE_DIR="${2:-/workspace}"

# Function to recursively process FileNode structure
process_node() {
    local json="$1"
    local parent_path="$2"
    
    # Extract node properties
    local name=$(echo "$json" | jq -r '.name')
    local type=$(echo "$json" | jq -r '.type')
    local content=$(echo "$json" | jq -r '.content // empty')
    local full_path="${parent_path}/${name}"
    
    if [ "$type" = "FOLDER" ]; then
        # Create directory
        mkdir -p "$full_path"
        echo "Created directory: $full_path"
        
        # Process children
        local children_count=$(echo "$json" | jq '.children | length // 0')
        for ((i=0; i<children_count; i++)); do
            local child=$(echo "$json" | jq ".children[$i]")
            process_node "$child" "$full_path"
        done
        
    elif [ "$type" = "FILE" ]; then
        # Create parent directory if needed
        mkdir -p "$(dirname "$full_path")"
        
        # Write file content
        if [ -n "$content" ]; then
            echo "$content" > "$full_path"
            echo "Created file: $full_path ($(wc -c < "$full_path") bytes)"
        else
            touch "$full_path"
            echo "Created empty file: $full_path"
        fi
        
        # Set executable permission for specific files
        if [[ "$name" == *.sh ]] || [[ "$name" == "Makefile" ]]; then
            chmod +x "$full_path"
        fi
    fi
}

# Main execution
main() {
    echo "Starting FileNode to workspace conversion..."
    echo "Target directory: $WORKSPACE_DIR"
    
    # Read JSON
    if [ "$INPUT_JSON" = "/dev/stdin" ]; then
        JSON_CONTENT=$(cat)
    else
        JSON_CONTENT=$(cat "$INPUT_JSON")
    fi
    
    # Validate JSON
    if ! echo "$JSON_CONTENT" | jq empty 2>/dev/null; then
        echo "Error: Invalid JSON input"
        exit 1
    fi
    
    # Clear workspace (optional - comment out if you want to preserve existing files)
    # rm -rf "${WORKSPACE_DIR:?}"/*
    
    # Create base workspace
    mkdir -p "$WORKSPACE_DIR"
    
    # Check if input is array of nodes or single node
    if echo "$JSON_CONTENT" | jq -e 'type == "array"' >/dev/null 2>&1; then
        # Process array of root nodes
        local node_count=$(echo "$JSON_CONTENT" | jq 'length')
        for ((i=0; i<node_count; i++)); do
            local node=$(echo "$JSON_CONTENT" | jq ".[$i]")
            process_node "$node" "$WORKSPACE_DIR"
        done
    else
        # Process single root node
        process_node "$JSON_CONTENT" "$WORKSPACE_DIR"
    fi
    
    echo "Conversion complete!"
    echo "Workspace contents:"
    tree "$WORKSPACE_DIR" 2>/dev/null || find "$WORKSPACE_DIR" -type f
}

# Run main function
main
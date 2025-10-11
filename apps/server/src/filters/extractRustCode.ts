

export default function extractRustCode(rawData: string): string {
    if(!rawData) return '';

    const codeMath = rawData.match(/```rust\s*([\s\S]*?)```/);
    if(codeMath && codeMath[1]) {
        return codeMath[1].trim();
    }

    const genericMatch = rawData.match(/```\s*([\s\S]*?)```/);
    if(genericMatch && genericMatch[1]) {
        return genericMatch[1].trim();
    }

    // nothing found
    return '';
}
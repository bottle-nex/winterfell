import React from 'react';

interface ZigzagTextProps {
    color: string; // The color for the zigzag lines
    thickness: string; // The thickness of the zigzag lines
    children: React.ReactNode; // The content (text) wrapped inside the component
}

const ZigzagText: React.FC<ZigzagTextProps> = ({ color, thickness, children }) => {
    return (
        <span
            className="zigzag-text"
            style={
                {
                    '--c': color,
                    '--s': thickness,
                } as React.CSSProperties
            }
        >
            {children}
        </span>
    );
};

export default ZigzagText;

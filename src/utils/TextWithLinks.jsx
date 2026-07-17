import React from 'react';

const TextWithLinks = ({ text, linkClassName = "text-blue-500 hover:text-blue-400 underline" }) => {
    if (!text) return null;
    
    // Regex to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    const parts = text.split(urlRegex);
    
    return (
        <>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <a 
                            key={i} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={linkClassName}
                        >
                            {part}
                        </a>
                    );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </>
    );
};

export default TextWithLinks;

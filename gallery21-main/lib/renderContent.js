import React from 'react'

const renderContent = (rawContentString) => {

    const processInlineStyles = (text, styleRanges) => {
        if (!styleRanges || styleRanges.length === 0) return text;

        // Sort style ranges by offset and length for consistent processing
        const sortedStyles = [...styleRanges].sort((a, b) => {
            if (a.offset !== b.offset) return a.offset - b.offset;
            return (a.offset + a.length) - (b.offset + b.length);
        });

        let result = '';
        const activeStyles = new Map(); // Use Map to track style positions

        // Process text character by character
        for (let i = 0; i < text.length; i++) {
            // Check if any styles start at this position
            sortedStyles.forEach(style => {
                if (style.offset === i) {
                    activeStyles.set(style, style.offset + style.length);
                }
            });

            // Close styles that end at this position
            const endingStyles = [];
            activeStyles.forEach((endOffset, style) => {
                if (endOffset === i) {
                    endingStyles.push(style);
                }
            });
            endingStyles.forEach(style => {
                activeStyles.delete(style);
            });

            // Add style tags if needed
            const currentStyles = Array.from(activeStyles.keys());
            if (currentStyles.length > 0) {
                result += openTags(text[i], currentStyles);
            } else {
                result += text[i];
            }
        }

        return result;
    };

    const getStyleTag = (style) => {
        switch (style) {
            case 'BOLD':
                return ['strong', ''];
            case 'ITALIC':
                return ['em', ''];
            case 'UNDERLINE':
                return ['span', ' class="underline"'];
            default:
                return ['span', ''];
        }
    };

    const openTags = (text, styles) => {
        // Sort styles to ensure consistent ordering (BOLD -> ITALIC -> UNDERLINE)
        const sortedStyles = styles.sort((a, b) => {
            const styleOrder = { BOLD: 1, ITALIC: 2, UNDERLINE: 3 };
            return styleOrder[a.style] - styleOrder[b.style];
        });

        const openingTags = sortedStyles.map(style => {
            const [tag, attrs] = getStyleTag(style.style);
            return `<${tag}${attrs}>`;
        }).join('');

        const closingTags = sortedStyles.reverse().map(style => {
            const [tag] = getStyleTag(style.style);
            return `</${tag}>`;
        }).join('');

        return `${openingTags}${text}${closingTags}`;
    };

    const renderBlock = (block, index) => {
        const { text, type, inlineStyleRanges } = block;
        const processedText = processInlineStyles(text, inlineStyleRanges);

        switch (type) {
            case 'ordered-list-item':
                return (
                    <li key={index}
                        className="list-decimal ml-6 [&_span.underline]:underline"
                        dangerouslySetInnerHTML={{ __html: processedText }} />
                );
            case 'unordered-list-item':
                return (
                    <li key={index}
                        className="list-disc ml-6 [&_span.underline]:underline"
                        dangerouslySetInnerHTML={{ __html: processedText }} />
                );
            default:
                return (
                    <p key={index}
                        className="mb-4 [&_span.underline]:underline"
                        dangerouslySetInnerHTML={{ __html: processedText }} />
                );
        }
    };

    try {
        const parsedContent = typeof rawContentString === 'string'
            ? JSON.parse(rawContentString)
            : rawContentString;

        if (!parsedContent || !parsedContent.blocks) {
            console.error("Invalid content format:", parsedContent);
            return <div className="text-red-500">Invalid content format</div>;
        }

        let currentList = null;
        let elements = [];
        parsedContent.blocks.forEach((block, index) => {
            const isListItem = ['ordered-list-item', 'unordered-list-item'].includes(block.type);
            if (isListItem) {
                if (!currentList || currentList.type !== block.type) {
                    // Start new list
                    if (currentList) {
                        elements.push(
                            <currentList.tag key={`list-${elements.length}`} className="my-4">
                                {currentList.items}
                            </currentList.tag>
                        );
                    }
                    currentList = {
                        type: block.type,
                        tag: block.type === 'ordered-list-item' ? 'ol' : 'ul',
                        items: []
                    };
                }
                currentList.items.push(renderBlock(block, `${index}-item`));
            } else {
                // Close any open list
                if (currentList) {
                    elements.push(
                        <currentList.tag key={`list-${elements.length}`} className="my-4">
                            {currentList.items}
                        </currentList.tag>
                    );
                    currentList = null;
                }
                elements.push(renderBlock(block, index));
            }
        });

        // Close final list if exists
        if (currentList) {
            elements.push(
                <currentList.tag key={`list-${elements.length}`} className="my-4">
                    {currentList.items}
                </currentList.tag>
            );
        }

        return <div className={`prose max-w-none [&_span.underline]:underline`}>{elements}</div>;
    } catch (error) {
        console.error("Error rendering content:", error);
        return <div className="text-red-500">Error rendering content: {error.message}</div>;
    }

}

export default renderContent;

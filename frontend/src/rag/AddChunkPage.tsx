import React, { useState } from 'react';

export function AddChunkPage() {
    const [chunkText, setChunkText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!chunkText.trim()) {
            setStatusMessage({ type: 'error', text: 'Chunk text cannot be empty.' });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            // POST request sending JSON body matching C# [FromBody]
            const response = await fetch('http://localhost:5188/api/DocumentChunks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chunkText: chunkText, // Matches documentChunk.ChunkText property
                }),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            setStatusMessage({ type: 'success', text: 'Chunk successfully created!' });
            setChunkText(''); // Clear input on success
        } catch (err: any) {
            setStatusMessage({
                type: 'error',
                text: err.message || 'An error occurred while saving the chunk.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Add Document Chunk</h1>
            <p style={styles.subheading}>
                Insert raw text chunks directly into the embeddings store via <code>/api/DocumentChunks</code>.
            </p>

            {statusMessage && (
                <div
                    style={{
                        ...styles.alert,
                        backgroundColor: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
                    }}
                >
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label} htmlFor="chunkText">
                    Chunk Text
                </label>
                <textarea
                    id="chunkText"
                    rows={8}
                    placeholder="Paste or enter chunk content here..."
                    value={chunkText}
                    onChange={(e) => setChunkText(e.target.value)}
                    style={styles.textarea}
                    disabled={isSubmitting}
                />

                <button
                    type="submit"
                    disabled={isSubmitting || !chunkText.trim()}
                    style={{
                        ...styles.button,
                        opacity: isSubmitting || !chunkText.trim() ? 0.6 : 1,
                        cursor: isSubmitting || !chunkText.trim() ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSubmitting ? 'Saving Chunk...' : 'Submit Chunk'}
                </button>
            </form>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: '700px',
    },
    heading: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: 600,
    },
    subheading: {
        color: '#94a3b8',
        margin: '0 0 24px 0',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#e2e8f0',
    },
    textarea: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#1e293b',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    button: {
        alignSelf: 'flex-start',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#0284c7',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'background-color 0.2s',
    },
    alert: {
        padding: '12px 16px',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '14px',
        marginBottom: '16px',
    },
};
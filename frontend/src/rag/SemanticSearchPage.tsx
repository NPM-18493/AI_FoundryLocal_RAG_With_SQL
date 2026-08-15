import React, { useState } from 'react';

// Types matching your C# DocumentChunk model
interface DocumentChunk {
    id?: string | number;
    chunkText: string;
    // Add other properties if your C# class includes them (e.g., score, metadata, etc.)
}

export function SemanticSearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DocumentChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Pass the search term as a URL query parameter
            const response = await fetch(
                `http://localhost:5188/api/DocumentChunks?query=${encodeURIComponent(query)}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data: DocumentChunk[] = await response.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch search results.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Semantic Search</h1>
            <p style={styles.subheading}>
                Query vector embeddings stored in your database.
            </p>

            {/* --- Search Bar Form --- */}
            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Enter search query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.input}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    style={{
                        ...styles.button,
                        opacity: isLoading || !query.trim() ? 0.6 : 1,
                        cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* --- Error State --- */}
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* --- Results Display --- */}
            <div style={styles.resultsContainer}>
                {isLoading && <p style={styles.mutedText}>Searching vector space...</p>}

                {!isLoading && hasSearched && results.length === 0 && !error && (
                    <p style={styles.mutedText}>No matching document chunks found.</p>
                )}

                {!isLoading && results.length > 0 && (
                    <div style={styles.cardList}>
                        <p style={styles.resultCount}>Found {results.length} result(s):</p>
                        {results.map((chunk, index) => (
                            <div key={chunk.id || index} style={styles.card}>
                                <div style={styles.cardHeader}>Chunk #{index + 1}</div>
                                <p style={styles.cardText}>{chunk.chunkText}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: '800px',
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
    searchForm: {
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#1e293b',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
    },
    button: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#0284c7',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'background-color 0.2s',
    },
    errorBox: {
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: '#b91c1c',
        color: '#ffffff',
        fontSize: '14px',
        marginBottom: '24px',
    },
    resultsContainer: {
        marginTop: '16px',
    },
    mutedText: {
        color: '#94a3b8',
        fontSize: '14px',
    },
    resultCount: {
        color: '#38bdf8',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '12px',
    },
    cardList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
    },
    cardHeader: {
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
    },
    cardText: {
        margin: 0,
        color: '#f8fafc',
        fontSize: '14px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
    },
};
import React, { useState, useEffect } from 'react';
import { AddChunkPage } from './rag/AddChunkPage';
import { SemanticSearchPage } from './rag/SemanticSearchPage';
import { ChatPage } from './rag/ChatPage';

type MenuId = 'semantic-search' | 'add-chunk' | 'chat';

export function App() {
    const [activeItem, setActiveItem] = useState<MenuId>('semantic-search');

    // Fix browser margins
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';
    }, []);

    return (
        <div style={styles.container}>
            {/* --- Sidebar Nav --- */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <span style={styles.logo}>VectorUI</span>
                </div>

                <nav style={styles.nav}>
                    <button
                        onClick={() => setActiveItem('semantic-search')}
                        style={{
                            ...styles.navButton,
                            ...(activeItem === 'semantic-search' ? styles.activeButton : {}),
                        }}
                    >
                        <span>🔍</span>
                        <span>Semantic Search</span>
                    </button>

                    <button
                        onClick={() => setActiveItem('add-chunk')}
                        style={{
                            ...styles.navButton,
                            ...(activeItem === 'add-chunk' ? styles.activeButton : {}),
                        }}
                    >
                        <span>➕</span>
                        <span>Add Chunk</span>
                    </button>
                    <button
                        onClick={() => setActiveItem('chat')}
                        style={{
                            ...styles.navButton,
                            ...(activeItem === 'chat' ? styles.activeButton : {}),
                        }}
                    >
                        <span>💬</span>
                        <span>Agent Chat</span>
                    </button>
                </nav>
            </aside>

            {/* --- Page View Container --- */}
            <main style={styles.content}>
                {activeItem === 'semantic-search' && <SemanticSearchPage />}
                {activeItem === 'add-chunk' && <AddChunkPage />}
                {activeItem === 'chat' && <ChatPage />}
            </main>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
    },
    brand: {
        padding: '24px 20px',
        borderBottom: '1px solid #334155',
    },
    logo: {
        fontWeight: 700,
        fontSize: '18px',
        color: '#38bdf8',
    },
    nav: {
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    navButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'left',
    },
    activeButton: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        padding: '40px',
        overflowY: 'auto',
    },
};

export default App;
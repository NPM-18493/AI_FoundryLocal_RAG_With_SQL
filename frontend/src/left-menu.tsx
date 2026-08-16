import React, { useState } from 'react';

// --- Types ---
type MenuId = 'semantic-search' | 'add-chunk';

interface MenuItem {
    id: MenuId;
    label: string;
    icon: string;
}

const MENU_ITEMS: MenuItem[] = [
    { id: 'semantic-search', label: 'Semantic Search', icon: '🔍' },
    { id: 'add-chunk', label: 'Add Chunk', icon: '➕' },
];

export function LeftMenu() {
    // Default active item set to Semantic Search
    const [activeItem, setActiveItem] = useState<MenuId>('semantic-search');

    return (
        <div style={styles.container}>
            {/* --- Left Navigation --- */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <div style={styles.logo}>VectorUI</div>
                </div>

                <nav style={styles.nav}>
                    {MENU_ITEMS.map((item) => {
                        const isActive = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                style={{
                                    ...styles.navButton,
                                    ...(isActive ? styles.activeButton : {}),
                                }}
                            >
                                <span style={styles.icon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* --- Main Content Area --- */}
            <main style={styles.content}>
                {activeItem === 'semantic-search' && <SemanticSearchView />}
                {activeItem === 'add-chunk' && <AddChunkView />}
            </main>
        </div>
    );
}

// --- Simple Views ---
function SemanticSearchView() {
    return (
        <div>
            <h1 style={styles.heading}>Semantic Search</h1>
            <p style={styles.description}>Search vectors across your embeddings database.</p>
            <input
                type="text"
                placeholder="Query vectors..."
                style={styles.input}
            />
        </div>
    );
}

function AddChunkView() {
    return (
        <div>
            <h1 style={styles.heading}>Add Chunk</h1>
            <p style={styles.description}>Insert raw text or document chunks into your knowledge store.</p>
            <textarea
                placeholder="Enter text chunk here..."
                rows={6}
                style={styles.textarea}
            />
        </div>
    );
}

// --- Clean, Standard Layout Styles ---
const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
    },
    brand: {
        padding: '24px 20px',
        borderBottom: '1px solid #334155',
    },
    logo: {
        fontWeight: 700,
        fontSize: '18px',
        letterSpacing: '0.5px',
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
        transition: 'all 0.15s ease',
    },
    activeButton: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
    },
    icon: {
        fontSize: '16px',
    },
    content: {
        flex: 1,
        padding: '40px',
        overflowY: 'auto',
    },
    heading: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: 600,
    },
    description: {
        color: '#94a3b8',
        margin: '0 0 24px 0',
    },
    input: {
        width: '100%',
        maxWidth: '500px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#1e293b',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
    },
    textarea: {
        width: '100%',
        maxWidth: '600px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#1e293b',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
    },
};

export default LeftMenu;
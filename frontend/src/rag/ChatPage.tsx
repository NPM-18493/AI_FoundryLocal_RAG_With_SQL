import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
}

export function ChatPage() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: trimmedPrompt,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Append user message and clear input
        setMessages((prev) => [...prev, userMessage]);
        setPrompt('');
        setIsLoading(true);
        setError(null);

        try {
            // Call HTTP GET with prompt as a URL query parameter
            const response = await fetch(
                `http://localhost:5188/api/Chat?prompt=${encodeURIComponent(trimmedPrompt)}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            // Read response (handles string, JSON string, or JSON object)
            const contentType = response.headers.get('content-type');
            let agentReplyText = '';

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                agentReplyText = typeof data === 'string' ? data : data.response || data.text || JSON.stringify(data);
            } else {
                agentReplyText = await response.text();
            }

            const agentMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'agent',
                text: agentReplyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, agentMessage]);
        } catch (err: any) {
            setError(err.message || 'Failed to get response from agent.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>AI Agent Chat</h1>
                <span style={styles.statusBadge}>
                    <span style={styles.statusDot} /> Active
                </span>
            </div>

            {/* Messages Feed */}
            <div style={styles.chatFeed}>
                {messages.length === 0 && (
                    <div style={styles.emptyState}>
                        <p>👋 Ask the agent anything to start the conversation.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div
                            key={msg.id}
                            style={{
                                ...styles.messageWrapper,
                                justifyContent: isUser ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    ...styles.bubble,
                                    backgroundColor: isUser ? '#0284c7' : '#1e293b',
                                    color: '#ffffff',
                                    borderBottomRightRadius: isUser ? '2px' : '12px',
                                    borderBottomLeftRadius: isUser ? '12px' : '2px',
                                }}
                            >
                                <div style={styles.senderLabel}>{isUser ? 'You' : 'Agent'}</div>
                                <div style={styles.messageText}>{msg.text}</div>
                                <div style={styles.timestamp}>{msg.timestamp}</div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                    <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                        <div style={{ ...styles.bubble, backgroundColor: '#1e293b', color: '#94a3b8' }}>
                            <div style={styles.senderLabel}>Agent</div>
                            <div style={styles.loadingText}>Thinking...</div>
                        </div>
                    </div>
                )}

                {/* Error Notification */}
                {error && <div style={styles.errorBox}>{error}</div>}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Type your prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    style={styles.input}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    style={{
                        ...styles.sendButton,
                        opacity: isLoading || !prompt.trim() ? 0.5 : 1,
                        cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 80px)',
        maxWidth: '900px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid #334155',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 600,
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#4ade80',
        backgroundColor: '#064e3b',
        padding: '4px 8px',
        borderRadius: '12px',
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#4ade80',
    },
    chatFeed: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    emptyState: {
        textAlign: 'center',
        color: '#64748b',
        marginTop: '40px',
        fontSize: '14px',
    },
    messageWrapper: {
        display: 'flex',
        width: '100%',
    },
    bubble: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    senderLabel: {
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px',
        opacity: 0.7,
    },
    messageText: {
        fontSize: '14px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
    },
    timestamp: {
        fontSize: '10px',
        opacity: 0.5,
        textAlign: 'right',
        marginTop: '4px',
    },
    loadingText: {
        fontSize: '13px',
        fontStyle: 'italic',
    },
    errorBox: {
        backgroundColor: '#991b1b',
        color: '#fef2f2',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
    },
    inputContainer: {
        display: 'flex',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
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
    sendButton: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#0284c7',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
    },
};
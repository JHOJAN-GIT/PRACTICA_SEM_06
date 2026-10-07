// Página Messages: chat en tiempo real entre pestañas usando BroadcastChannel API
// Sin backend — los mensajes se transmiten solo mientras las pestañas están abiertas
// BroadcastChannel es nativo del navegador, no requiere librerías externas

import { useState, useEffect, useRef } from 'react';
import styles from './Messages.module.css';

// Canal compartido — cualquier pestaña con la misma origin y mismo nombre lo recibe
const CHANNEL_NAME = 'techstore-messages';

function Messages() {
  const [messages, setMessages] = useState([]);   // lista de mensajes recibidos
  const [text, setText]         = useState('');   // input controlado
  const [name, setName]         = useState('');   // nombre del usuario
  const [nameSet, setNameSet]   = useState(false);// ¿ya eligió nombre?
  const [nameInput, setNameInput] = useState(''); // input del nombre
  const channelRef  = useRef(null);               // referencia al canal
  const bottomRef   = useRef(null);               // scroll automático al final
  const myId        = useRef(`user-${Date.now()}`); // ID único de esta pestaña

  // Inicializar BroadcastChannel al montar, limpiar al desmontar
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    // Escucha mensajes de OTRAS pestañas
    channel.onmessage = (event) => {
      const msg = event.data;
      if (msg.type === 'CHAT_MESSAGE') {
        setMessages((prev) => [...prev, { ...msg, own: false }]);
      }
      if (msg.type === 'USER_JOIN') {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: 'SYSTEM', text: `${msg.name} se unió al chat 👋`, ts: new Date().toISOString() },
        ]);
      }
      if (msg.type === 'USER_LEAVE') {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: 'SYSTEM', text: `${msg.name} abandonó el chat`, ts: new Date().toISOString() },
        ]);
      }
    };

    // Cleanup al desmontar: cerrar canal
    return () => {
      channel.close();
    };
  }, []);

  // Scroll automático cuando llegan nuevos mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notificar a otras pestañas que este usuario se unió/fue
  const handleJoin = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const n = nameInput.trim();
    setName(n);
    setNameSet(true);
    channelRef.current?.postMessage({ type: 'USER_JOIN', name: n });
    // Mensaje local de bienvenida
    setMessages([{
      id: Date.now(),
      type: 'SYSTEM',
      text: `Bienvenido al canal, ${n}! Abre otra pestaña en /messages para chatear.`,
      ts: new Date().toISOString(),
    }]);
  };

  // Enviar mensaje a todas las pestañas abiertas en /messages
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msg = {
      id:   Date.now(),
      type: 'CHAT_MESSAGE',
      text: text.trim(),
      name,
      senderId: myId.current,
      ts:   new Date().toISOString(),
      own:  true, // esta pestaña es el emisor
    };

    // Agrega a estado local inmediatamente
    setMessages((prev) => [...prev, msg]);

    // Broadcast a otras pestañas (BroadcastChannel no se auto-recibe)
    channelRef.current?.postMessage({ ...msg, own: false });

    setText('');
  };

  // Formatear timestamp
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  // ===== PANTALLA DE NOMBRE =====
  if (!nameSet) {
    return (
      <main className={styles.main}>
        <div className={styles.joinWrap}>
          <div className={styles.joinCard}>
            <span className={styles.joinIcon}>💬</span>
            <h2 className={styles.joinTitle}>Sala de Mensajes</h2>
            <p className={styles.joinDesc}>
              Abre esta página en <strong>otra pestaña</strong> del navegador para
              chatear en tiempo real sin servidor.
            </p>
            <form onSubmit={handleJoin} className={styles.joinForm}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tu nombre..."
                className={styles.joinInput}
                autoFocus
                maxLength={24}
              />
              <button type="submit" className={styles.joinBtn} disabled={!nameInput.trim()}>
                Entrar al chat →
              </button>
            </form>
            <p className={styles.joinHint}>
              ⚡ Usa <code>BroadcastChannel</code> — solo funciona entre pestañas del mismo navegador.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ===== SALA DE CHAT =====
  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>

        {/* Header del chat */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <span className={styles.chatIcon}>💬</span>
            <div>
              <h2 className={styles.chatTitle}>Sala General</h2>
              <span className={styles.chatSub}>Canal: {CHANNEL_NAME}</span>
            </div>
          </div>
          <div className={styles.chatHeaderRight}>
            <span className={styles.onlineDot} />
            <span className={styles.onlineLabel}>En línea como <strong>{name}</strong></span>
          </div>
        </div>

        {/* Lista de mensajes */}
        <div className={styles.messagesList}>
          {messages.length === 0 && (
            <p className={styles.emptyChat}>Aún no hay mensajes. ¡Sé el primero!</p>
          )}

          {/* Renderizado iterativo con .map() y key única */}
          {messages.map((msg) => {
            // Mensaje del sistema (join/leave)
            if (msg.type === 'SYSTEM') {
              return (
                <div key={msg.id} className={styles.systemMsg}>
                  {msg.text}
                </div>
              );
            }

            // Renderizado condicional: propio vs ajeno
            return (
              <div
                key={msg.id}
                className={`${styles.msgRow} ${msg.own ? styles.msgOwn : styles.msgOther}`}
              >
                {/* Avatar con inicial */}
                {!msg.own && (
                  <span className={`${styles.avatar} ${msg.fromForm ? styles.avatarForm : ''}`}>
                    {msg.fromForm ? '📋' : (msg.name?.[0]?.toUpperCase() || '?')}
                  </span>
                )}
                <div className={`${styles.bubble} ${msg.fromForm ? styles.bubbleForm : ''}`}>
                  {/* Nombre + badge si viene del formulario */}
                  {!msg.own && (
                    <span className={styles.bubbleName}>
                      {msg.name}
                      {msg.fromForm && <span className={styles.formBadge}>📋 Formulario</span>}
                    </span>
                  )}
                  <p className={styles.bubbleText}>{msg.text}</p>
                  <span className={styles.bubbleTime}>{formatTime(msg.ts)}</span>
                </div>
              </div>
            );
          })}

          {/* Ancla para scroll automático */}
          <div ref={bottomRef} />
        </div>

        {/* Input de mensaje */}
        <form onSubmit={handleSend} className={styles.inputRow}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className={styles.msgInput}
            maxLength={200}
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!text.trim()}
            aria-label="Enviar mensaje"
          >
            Enviar ➤
          </button>
        </form>

      </div>
    </main>
  );
}

export default Messages;

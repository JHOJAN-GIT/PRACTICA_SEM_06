// Página Form: formulario controlado con useState
// Demuestra: controlled inputs, onChange, onSubmit, validación, renderizado condicional
// Al enviar, transmite el mensaje por BroadcastChannel → lo recibe /messages en tiempo real

import { useState } from 'react';
import styles from './Form.module.css';

// Mismo nombre de canal que Messages.jsx → ambas páginas comparten el canal
const CHANNEL_NAME = 'techstore-messages';

// Estado inicial del formulario → facilita el reset
const INITIAL_FORM = {
  name:    '',
  email:   '',
  subject: '',
  message: '',
  rating:  '',
};

// Opciones del select de asunto
const SUBJECTS = [
  { value: '',          label: 'Selecciona un asunto...' },
  { value: 'soporte',   label: '🔧 Soporte técnico' },
  { value: 'compra',    label: '🛒 Consulta de compra' },
  { value: 'devolucion',label: '↩️ Devolución / Reembolso' },
  { value: 'otro',      label: '💬 Otro' },
];

function Form() {
  // Estado único del formulario → controlled inputs
  const [form, setForm]         = useState(INITIAL_FORM);
  // Estado de errores de validación por campo
  const [errors, setErrors]     = useState({});
  // Estado de envío: idle | loading | success | error
  const [status, setStatus]     = useState('idle');

  // Handler genérico: actualiza solo el campo que cambió
  // → un solo handler para todos los inputs (DRY)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo al corregirlo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validación manual del formulario → sin librerías externas
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())
      newErrors.name = 'El nombre es obligatorio';
    if (!form.email.trim())
      newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Formato de correo inválido';
    if (!form.subject)
      newErrors.subject = 'Selecciona un asunto';
    if (!form.message.trim())
      newErrors.message = 'El mensaje es obligatorio';
    else if (form.message.trim().length < 10)
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    return newErrors;
  };

  // onSubmit: async/await simulado (simula envío a API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');

    try {
      // Simula petición async a la API (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Emite el mensaje por BroadcastChannel → /messages lo recibe en tiempo real
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({
        id:       Date.now(),
        type:     'CHAT_MESSAGE',
        text:     `[${form.subject.toUpperCase()}] ${form.message}`,
        name:     `${form.name} (${form.email})`,
        senderId: 'form-page',
        ts:       new Date().toISOString(),
        own:      false,
        fromForm: true,
      });
      channel.close(); // canal de un solo uso, cerrar inmediatamente

      setStatus('success');
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Columna izquierda: info */}
        <div className={styles.infoPanel}>
          <div className={styles.infoBadge}>✉️ Contacto</div>
          <h1 className={styles.infoTitle}>
            ¿Tienes alguna
            <span className={styles.infoGradient}> pregunta?</span>
          </h1>
          <p className={styles.infoText}>
            Completa el formulario y nuestro equipo te responderá a la brevedad.
          </p>

          <div className={styles.infoItems}>
            {[
              { icon: '📧', label: 'Email', val: 'soporte@techstore.pe' },
              { icon: '📍', label: 'Facultad', val: 'Ing. Sistemas — UNCP' },
              { icon: '🕐', label: 'Respuesta', val: 'Dentro de 24 horas' },
            ].map(({ icon, label, val }) => (
              <div key={label} className={styles.infoItem}>
                <span className={styles.infoIcon}>{icon}</span>
                <div>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: formulario */}
        <div className={styles.formPanel}>

          {/* Renderizado condicional: éxito tras submit */}
          {status === 'success' ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>✅</span>
              <h2>¡Mensaje enviado!</h2>
              <p>Te responderemos pronto. Gracias por contactarnos.</p>
              <button onClick={handleReset} className={styles.btnPrimary}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <h2 className={styles.formTitle}>Envíanos un mensaje</h2>

              {/* Renderizado condicional: error global de envío */}
              {status === 'error' && (
                <div className={styles.errorAlert} role="alert">
                  ⚠️ Hubo un error al enviar. Inténtalo de nuevo.
                </div>
              )}

              {/* Row: nombre + email */}
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nombre completo *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jhojan Antezana"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    autoComplete="name"
                  />
                  {/* Renderizado condicional &&: error solo si existe */}
                  {errors.name && (
                    <span className={styles.fieldError}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Correo electrónico *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="usuario@uncp.edu.pe"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className={styles.fieldError}>{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Asunto (select controlado) */}
              <div className={styles.fieldGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.subject ? styles.inputError : ''}`}
                >
                  {/* Renderizado iterativo con .map() + key */}
                  {SUBJECTS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <span className={styles.fieldError}>{errors.subject}</span>
                )}
              </div>

              {/* Mensaje (textarea controlado) */}
              <div className={styles.fieldGroup}>
                <label htmlFor="message" className={styles.label}>
                  Mensaje *
                  <span className={styles.charCount}>
                    {form.message.length} / 500
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  maxLength={500}
                  rows={5}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                />
                {errors.message && (
                  <span className={styles.fieldError}>{errors.message}</span>
                )}
              </div>

              {/* Valoración */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Valoración (opcional)</label>
                <div className={styles.ratingGroup}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className={styles.ratingLabel}>
                      <input
                        type="radio"
                        name="rating"
                        value={val}
                        checked={form.rating === String(val)}
                        onChange={handleChange}
                        className={styles.ratingInput}
                      />
                      <span className={`${styles.ratingStar} ${form.rating >= val ? styles.ratingStarActive : ''}`}>
                        ★
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.btnSecondary}
                  disabled={status === 'loading'}
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={status === 'loading'}
                >
                  {/* Ternario: texto del botón según estado */}
                  {status === 'loading' ? (
                    <span className={styles.spinner}>Enviando...</span>
                  ) : (
                    'Enviar mensaje →'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Form;

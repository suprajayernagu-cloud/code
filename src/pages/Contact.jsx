import React, { useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill all fields.')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY'
      )

      setStatus('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error(error)
      setStatus('Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.heading}>Contact Hiringstoday</h1>
      <p style={styles.text}>
        Have questions or feedback? Reach us directly at{' '}
        <strong>hello@hiringstoday.com</strong>
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </form>
    </main>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '1.5rem',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  text: {
    marginBottom: '1.5rem',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginTop: '0.3rem',
  },
  textarea: {
    width: '100%',
    padding: '0.6rem',
    marginTop: '0.3rem',
  },
  button: {
    padding: '0.7rem',
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  status: {
    marginTop: '0.5rem',
  },
}

export default Contact

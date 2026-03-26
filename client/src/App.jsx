import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://contact-manager-app-b01w.onrender.com/api/contacts'

function App() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    setLoading(true)
    const res = await axios.get(API)
    setContacts(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await axios.put(`${API}/${editId}`, form)
      setEditId(null)
    } else {
      await axios.post(API, form)
    }
    setForm({ name: '', email: '', phone: '' })
    fetchContacts()
  }

  const handleEdit = (contact) => {
    setEditId(contact._id)
    setForm({ name: contact.name, email: contact.email, phone: contact.phone })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this contact?')) {
      await axios.delete(`${API}/${id}`)
      fetchContacts()
    }
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const colors = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#10b981','#3b82f6']
  const getColor = (name) => colors[name.charCodeAt(0) % colors.length]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
           Contact Manager
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 8, fontSize: 15 }}>
          Manage your contacts in one place
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Form Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 18, color: '#1e1b4b', fontWeight: 600 }}>
            {editId ? ' Edit Contact' : ' Add New Contact'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name *</label>
                <input
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.border = '1.5px solid #6366f1'}
                  onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                <input
                  placeholder="Phone No."
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1.5px solid #6366f1'}
                  onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address *</label>
              <input
                placeholder="youremail@gmail.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #6366f1'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ flex: 1, padding: '11px', background: editId ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, letterSpacing: '0.3px' }}>
                {editId ? ' Update Contact' : 'Add Contact'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ name: '', email: '', phone: '' }) }}
                  style={{ padding: '11px 20px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search + Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
          <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Contact Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#fff', padding: 40, fontSize: 15 }}>Loading contacts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 40, color: '#fff' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ margin: 0, fontSize: 15 }}>{search ? 'No contacts match your search' : 'No contacts yet. Add your first one!'}</p>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c._id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

              {/* Avatar */}
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: getColor(c.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {getInitials(c.name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1e1b4b', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>✉ {c.email}{c.phone && ` ·  ${c.phone}`}</div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleEdit(c)}
                  style={{ padding: '7px 14px', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(c._id)}
                  style={{ padding: '7px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
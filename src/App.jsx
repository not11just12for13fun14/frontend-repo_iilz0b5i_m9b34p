import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { MessageSquare, Bell, CreditCard, BookOpen, Send, Plus } from 'lucide-react'

const brand = {
  bg: 'bg-gradient-to-br from-white to-cyan-50',
  card: 'bg-white/80 backdrop-blur border border-cyan-100',
  primary: 'bg-cyan-500 hover:bg-cyan-600',
  text: 'text-cyan-700',
  accent: 'text-cyan-500',
}

function Navbar({ current, setCurrent }) {
  const tabs = [
    { key: 'classes', label: 'Classes', icon: BookOpen },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'chat', label: 'Class Chat', icon: MessageSquare },
  ]
  return (
    <nav className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-2xl shadow-lg ${brand.card}`}>
      <ul className="flex gap-3">
        {tabs.map(t => {
          const Icon = t.icon
          const active = current === t.key
          return (
            <li key={t.key}>
              <button
                onClick={() => setCurrent(t.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${active ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon size={18} />
                <span className="text-sm hidden sm:block">{t.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Section({ title, children, action }) {
  return (
    <section className={`max-w-md mx-auto w-full ${brand.card} rounded-2xl p-5 shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${brand.text}`}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Classes() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ code: '', name: '', instructor: '', schedule: '' })
  const load = async () => setItems(await api.listClasses())
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.code || !form.name) return
    await api.createClass(form)
    setForm({ code: '', name: '', instructor: '', schedule: '' })
    load()
  }

  return (
    <Section title="Your Classes" action={
      <button onClick={add} className={`flex items-center gap-1 ${brand.primary} text-white px-3 py-2 rounded-lg text-sm`}>
        <Plus size={16} /> Add
      </button>
    }>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {['code','name','instructor','schedule'].map(k => (
            <input key={k} placeholder={k}
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
              className="px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
          ))}
        </div>
        <ul className="divide-y divide-cyan-100">
          {items.map(c => (
            <li key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{c.name} <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{c.code}</span></p>
                <p className="text-xs text-gray-500">{c.instructor} • {c.schedule}</p>
              </div>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No classes yet. Add one above.</p>}
        </ul>
      </div>
    </Section>
  )
}

function Notifications() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', body: '', class_code: '' })
  const load = async () => setItems(await api.listNotifications())
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.title || !form.body) return
    await api.createNotification(form)
    setForm({ title: '', body: '', class_code: '' })
    load()
  }

  return (
    <Section title="Notifications" action={
      <button onClick={add} className={`flex items-center gap-1 ${brand.primary} text-white px-3 py-2 rounded-lg text-sm`}>
        <Plus size={16} /> Post
      </button>
    }>
      <div className="space-y-3">
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        <textarea placeholder="Message" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        <input placeholder="Class code (optional)" value={form.class_code} onChange={e => setForm({ ...form, class_code: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        <ul className="divide-y divide-cyan-100">
          {items.map(n => (
            <li key={n.id} className="py-3">
              <p className="font-medium text-gray-800">{n.title}</p>
              <p className="text-sm text-gray-600">{n.body}</p>
              {n.class_code && <p className="text-xs text-cyan-700 mt-1">Class: {n.class_code}</p>}
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No notifications yet.</p>}
        </ul>
      </div>
    </Section>
  )
}

function Payments() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ student_id: '', amount: '', term: '' })
  const load = async () => setItems(await api.listPayments())
  useEffect(() => { load() }, [])

  const pay = async () => {
    if (!form.student_id || !form.amount || !form.term) return
    await api.createPayment({ ...form, amount: parseFloat(form.amount), status: 'pending' })
    setForm({ student_id: '', amount: '', term: '' })
    load()
  }

  return (
    <Section title="Tuition Payments" action={
      <button onClick={pay} className={`flex items-center gap-1 ${brand.primary} text-white px-3 py-2 rounded-lg text-sm`}>
        <CreditCard size={16} /> Pay
      </button>
    }>
      <div className="space-y-3">
        <input placeholder="Student ID" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
            className="px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
          <input placeholder="Term" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}
            className="px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        </div>
        <ul className="divide-y divide-cyan-100">
          {items.map(p => (
            <li key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{p.student_id} • {p.term}</p>
                <p className="text-xs text-gray-500">${p.amount} • {p.status}</p>
              </div>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No payments yet.</p>}
        </ul>
      </div>
    </Section>
  )
}

function Chat() {
  const [classCode, setClassCode] = useState('CS101')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const load = async () => setMessages(await api.getMessages(classCode))
  useEffect(() => { load() }, [classCode])

  const send = async () => {
    if (!text.trim()) return
    await api.postMessage(classCode, { class_code: classCode, author: 'You', content: text })
    setText('')
    load()
  }

  return (
    <Section title={`Chat • ${classCode}`} action={
      <input value={classCode} onChange={e => setClassCode(e.target.value)}
        className="px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm"
        placeholder="Class code" />
    }>
      <div className="h-72 overflow-y-auto space-y-3 pr-1">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] p-3 rounded-xl ${m.author === 'You' ? 'ml-auto bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-900'}`}>
            <p className="text-xs opacity-80 mb-1">{m.author}</p>
            <p className="text-sm">{m.content}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet. Be the first to say hi!</p>}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message"
          className="flex-1 px-3 py-2 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm" />
        <button onClick={send} className={`${brand.primary} text-white px-4 py-2 rounded-lg flex items-center gap-2`}>
          <Send size={16} /> Send
        </button>
      </div>
    </Section>
  )
}

function App() {
  const [current, setCurrent] = useState('classes')

  return (
    <div className={`min-h-screen ${brand.bg} pb-24`}> 
      <header className="max-w-md mx-auto pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Uni Portal</h1>
        <p className="text-center text-sm text-gray-500">White and turquoise vibes</p>
      </header>

      <main className="space-y-4 px-4">
        {current === 'classes' && <Classes />}
        {current === 'notifications' && <Notifications />}
        {current === 'payments' && <Payments />}
        {current === 'chat' && <Chat />}
      </main>

      <Navbar current={current} setCurrent={setCurrent} />
    </div>
  )
}

export default App

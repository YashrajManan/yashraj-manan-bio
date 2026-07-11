import { useEffect, useState } from 'react'
import { addDoc, collection, doc, increment, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'

function VisitCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const visitsRef = doc(db, 'stats', 'visits')
    setDoc(visitsRef, { count: increment(1) }, { merge: true }).catch(() => {})
    const unsubscribe = onSnapshot(visitsRef, (snap) => {
      setCount(snap.data()?.count ?? null)
    })
    return () => unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      await addDoc(collection(db, 'guestbook'), { name: trimmed, timestamp: serverTimestamp() })
      setSubmitted(true)
      setName('')
    } catch {
      // ignore — guestbook is a bonus, not critical
    }
  }

  return (
    <footer className="visit-footer">
      <p className="visit-count">{count === null ? 'Loading visits…' : `${count.toLocaleString()} visits`}</p>
      {submitted ? (
        <p className="visit-thanks">Thanks for stopping by!</p>
      ) : (
        <form className="visit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Leave your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={59}
          />
          <button type="submit">Sign guestbook</button>
        </form>
      )}
    </footer>
  )
}

export default VisitCounter

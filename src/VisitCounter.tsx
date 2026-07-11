import { useEffect, useState } from 'react'
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'

function VisitCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const visitsRef = doc(db, 'stats', 'visits')
    setDoc(visitsRef, { count: increment(1) }, { merge: true }).catch(() => {})
    const unsubscribe = onSnapshot(visitsRef, (snap) => {
      setCount(snap.data()?.count ?? null)
    })
    return () => unsubscribe()
  }, [])

  return (
    <footer className="visit-footer">
      <p className="visit-count">{count === null ? 'Loading visits…' : `${count.toLocaleString()} visits`}</p>
    </footer>
  )
}

export default VisitCounter

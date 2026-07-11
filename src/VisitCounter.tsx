import { useEffect, useState } from 'react'

const COUNTER_URL = 'https://api.counterapi.dev/v1/yashraj-manan-bio/page-visits/up'

function VisitCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(COUNTER_URL)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {})
  }, [])

  return (
    <footer className="visit-footer">
      <p className="visit-count">{count === null ? 'Loading visits…' : `${count.toLocaleString()} visits`}</p>
    </footer>
  )
}

export default VisitCounter

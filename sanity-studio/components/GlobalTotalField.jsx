import {useClient} from 'sanity'
import {useEffect, useMemo, useState} from 'react'

export default function GlobalTotalField() {
  const client = useClient({apiVersion: '2025-03-02', perspective: 'raw'})
  const [total, setTotal] = useState(null)
  const [today, setToday] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ts, setTs] = useState(Date.now())

  const nf = useMemo(() => new Intl.NumberFormat('nb-NO'), [])
  const dt = useMemo(
    () => new Intl.DateTimeFormat('nb-NO', {dateStyle: 'short', timeStyle: 'short'}),
    [],
  )

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const doc = await client.fetch(`*[_id=="stats.global"][0]{sessionsTotal, days}`)
      const totalV = Number(doc?.sessionsTotal || 0)
      const nowOslo = new Intl.DateTimeFormat('no-NO', {
        timeZone: 'Europe/Oslo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .format(new Date())
        .replaceAll('.', '-')
        .replace(/-$/, '')
      const todayV = Number(doc?.days?.[nowOslo]?.sessions || 0)
      setTotal(totalV)
      setToday(todayV)
      setTs(Date.now())
    } catch (e) {
      setErr(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div
      style={{
        border: '1px solid var(--card-border-color,#e5e7eb)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--card-bg-color,#fff)',
        display: 'grid',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div style={{fontWeight: 600}}>Besøk på siden</div>

      {err ? (
        <div style={{color: '#b91c1c', fontSize: 12}}>Feil: {err}</div>
      ) : loading || total === null ? (
        <div style={{opacity: 0.7}}>Laster…</div>
      ) : (
        <div style={{fontSize: 32, fontWeight: 700, lineHeight: 1, color: '#DA627D'}}>
          {nf.format(total)}
        </div>
      )}

      {today !== null && !loading && !err && (
        <div style={{fontSize: 12, opacity: 0.7}}>Besøk i dag: {nf.format(today)}</div>
      )}

      <div
        style={{
          fontSize: 12,
          opacity: 0.7,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Sist oppdatert: {dt.format(ts)}</span>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: '4px 10px',
            background: 'transparent',
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Oppdaterer…' : 'Oppdater'}
        </button>
      </div>
    </div>
  )
}

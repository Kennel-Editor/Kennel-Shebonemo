import React from 'react'

export default function AdminLinkField(props) {
  const url = props.value
  return (
    <div style={{paddingTop: 6}}>
      {url ? (
        <a href={url} target="_blank" rel="noopener" style={{color: '#DA627D'}}>
          https://shebonemo.no/admin
        </a>
      ) : (
        <em>Ingen link satt</em>
      )}
      <div style={{fontSize: 12, opacity: 0.7, marginTop: 6}}>
        trykk her og kom direkte til kontrollpanelet ditt
      </div>
    </div>
  )
}

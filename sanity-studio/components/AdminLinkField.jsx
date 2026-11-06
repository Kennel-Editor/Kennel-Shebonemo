import React from 'react'

export default function AdminLinkField(props) {
  const url = props.value || 'https://shebonemo.no/admin'
  return (
    <div style={{paddingTop: 6}}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{color: '#DA627D'}}>
        {url}
      </a>
      <div style={{fontSize: 12, opacity: 0.7, marginTop: 6}}>
        Trykk her for å åpne kontrollpanelet med besøkstall.
      </div>
    </div>
  )
}

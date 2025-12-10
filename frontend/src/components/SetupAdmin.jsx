import React, { useState } from 'react'
export default function SetupAdmin({ onCreate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100vh'}}>
      <div className="card" style={{width:520}}>
        <h2>Première configuration — Créer l'administrateur</h2>
        <div style={{marginTop:12}}>
          <label className="small-muted">Nom d'utilisateur</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <label className="small-muted">Mot de passe</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn btn-primary" onClick={() => onCreate({username,password,role:'admin'})}>Créer le compte administrateur</button>
        </div>
      </div>
    </div>
  )
}
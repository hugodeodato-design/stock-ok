import React from 'react'
export default function LoginPage({ form, setForm, onLogin, error }) {
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100vh'}}>
      <div className="card" style={{width:420}}>
        <h2>MRDPS 27 — Connexion</h2>
        <p className="small-muted">Connectez-vous pour accéder à l'application.</p>
        <div style={{marginTop:12}}>
          <label className="small-muted">Nom d'utilisateur</label>
          <input className="input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        </div>
        <div style={{marginTop:12}}>
          <label className="small-muted">Mot de passe</label>
          <input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        {error && <p style={{color:'var(--danger)',marginTop:8}}>{error}</p>}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn btn-primary" onClick={onLogin}>Se connecter</button>
        </div>
      </div>
    </div>
  )
}
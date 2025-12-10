import React from 'react'
import { Settings, LogOut, User, Shield } from 'lucide-react'
export default function TopBar({ user, onOptions, onLogout }){
  return (
    <div className="card header" style={{marginBottom:16}}>
      <div>
        <h1>MRDPS 27</h1>
        <div className="small-muted">Gestion de stock simple</div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#f1f5f9',padding:'8px 12px',borderRadius:8}}>
          <User size={18} />
          <strong>{user?.username}</strong>
          {user?.role === 'admin' && <Shield size={14} />}
        </div>
        {user?.role === 'admin' && <button className="btn" onClick={onOptions}><Settings /></button>}
        <button className="btn btn-danger" onClick={onLogout}><LogOut /></button>
      </div>
    </div>
  )
}
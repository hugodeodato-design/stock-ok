import React, { useState } from 'react'
export default function UserManagement({ users, createUser, updateUser, deleteUser }){
  const [form, setForm] = useState({ username:'', password:'', role:'user' })
  const [editing, setEditing] = useState(null)
  const onAdd = async () => { try { await createUser(form); setForm({ username:'', password:'', role:'user' }); alert('Utilisateur créé') } catch (e) { alert(e.message) } }
  const onSaveEdit = () => { if (!editing) return; updateUser(editing.id, { username: editing.username }); setEditing(null); alert('Modifié') }
  return (
    <div className="card">
      <h3>Gestion des utilisateurs</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 200px',gap:8,marginTop:8}}>
        <input className="input" placeholder="Nom d'utilisateur" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input className="input" placeholder="Mot de passe" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <div style={{marginTop:8}}>
        <button className="btn btn-primary" onClick={onAdd}>Ajouter</button>
      </div>
      <div style={{marginTop:12}}>
        <table className="table">
          <thead><tr><th>Utilisateur</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>{users.map(u => (<tr key={u.id}><td>{u.username}</td><td><span className="label-chip">{u.role}</span></td><td><button className="btn" onClick={()=>setEditing({...u, password:''})}>Modifier</button><button className="btn" onClick={()=>{ if(confirm('Supprimer ?')) deleteUser(u.id) }}>Supprimer</button></td></tr>))}</tbody>
        </table>
      </div>
      {editing && (<div style={{marginTop:12}} className="card"><h4>Modifier</h4><input className="input" value={editing.username} onChange={e=>setEditing({...editing, username:e.target.value})} /><div style={{marginTop:8}}><button className="btn btn-primary" onClick={onSaveEdit}>Sauvegarder</button><button className="btn" onClick={()=>setEditing(null)}>Annuler</button></div></div>)}
    </div>
  )
}
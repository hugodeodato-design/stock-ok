import React from 'react'
import { Trash2 } from 'lucide-react'
export default function ArticleTable({ articles, onEdit, onDelete }){
  return (
    <div className="card">
      <table className="table">
        <thead><tr><th>Client</th><th>Réf</th><th>Désignation</th><th>Entrée</th><th>Sortie</th><th>Emplacement</th><th>Quantité</th><th>Infos</th><th>Action</th></tr></thead>
        <tbody>{articles.map(a => (<tr key={a.id} style={{background: a.quantite === 0 ? '#fff1f2' : 'transparent'}}><td onClick={()=>onEdit(a)} style={{cursor:'pointer'}}>{a.client}</td><td onClick={()=>onEdit(a)} style={{cursor:'pointer'}}>{a.reference}</td><td onClick={()=>onEdit(a)} style={{cursor:'pointer'}}>{a.designation}</td><td>{a.dateEntree || '-'}</td><td>{a.dateSortie || 'En stock'}</td><td>{a.emplacement || '-'}</td><td>{a.quantite || 0}</td><td>{a.autresInfos || '-'}</td><td><button className="btn" onClick={(e)=>{e.stopPropagation(); if(confirm('Supprimer ?')) onDelete(a.id)}} title="Supprimer"><Trash2 size={16} /></button></td></tr>))}</tbody>
      </table>
    </div>
  )
}
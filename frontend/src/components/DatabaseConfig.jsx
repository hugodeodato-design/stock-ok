import React from 'react'
export default function DatabaseConfig({ config, setConfig, onSave }){
  return (
    <div className="card" style={{marginBottom:12}}>
      <h3>Configuration Base de Données</h3>
      <div style={{marginTop:8}}>
        <label className="small-muted">Type</label>
        <select className="input" value={config.type} onChange={e => setConfig({...config, type: e.target.value})}>
          <option value="local">Local (localStorage)</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="mongodb">MongoDB</option>
        </select>
      </div>
      <div style={{marginTop:12}}>
        <button className="btn btn-primary" onClick={onSave}>Enregistrer la configuration</button>
      </div>
    </div>
  )
}
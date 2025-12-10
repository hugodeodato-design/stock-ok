  return (
    <>
      {!showOptions && (
        <>
          <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div>
              <button className="btn btn-primary" onClick={()=>{ setShowArticleForm(v=>!v); setEditingArticle(null) }}>Nouvel Article</button>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input className="input" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} />
              <select value={selectedClient} onChange={e=>setSelectedClient(e.target.value)} className="input">
                <option value="">-- Export par client --</option>
                {clientsList.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn" onClick={()=>{ if(selectedClient) exportExcelByClient(selectedClient); else alert('Choisissez un client') }}>Exporter XLSX</button>
            </div>
          </div>

          {showArticleForm && (
            <ArticleForm onAdd={async (d)=>{ await addArticle(d); setShowArticleForm(false) }} onUpdate={async (id,patch)=>{ await updateArticle(id,patch); setShowArticleForm(false) }} editingArticle={editingArticle} onCancel={()=>{ setShowArticleForm(false); setEditingArticle(null) }} />
          )}

          <ArticleTable articles={filtered} onEdit={(a)=>{ setEditingArticle(a); setShowArticleForm(true) }} onDelete={async (id)=>{ await deleteArticle(id) }} />

          <div style={{marginTop:12}} className="card">
            <p className="small-muted">Total: <strong>{articles.length}</strong> • En stock: <strong>{articles.filter(a=>!a.dateSortie).length}</strong></p>
          </div>
        </>
      )}
    </div>
    </>
  )
}

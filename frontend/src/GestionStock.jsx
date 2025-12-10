import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import TopBar from './components/TopBar'
import LoginPage from './components/LoginPage'
import SetupAdmin from './components/SetupAdmin'
import ArticleForm from './components/ArticleForm'
import ArticleTable from './components/ArticleTable'
import DatabaseConfig from './components/DatabaseConfig'
import UserManagement from './components/UserManagement'
import useLocalUsers from './hooks/useUsers'
import useLocalArticles from './hooks/useArticles'

const API_BASE = 'http://localhost:4000/api'

export default function GestionStock(){
  const localUsers = useLocalUsers()
  const localArticles = useLocalArticles([
    { id: 'demo-1', client: 'Entreprise ABC', reference: 'REF-001', designation: 'Palette de cartons', dateEntree: '2024-12-01', dateSortie: '', emplacement: 'A-12', quantite: 5, autresInfos: 'Fragile' }
  ])

  const [useApi, setUseApi] = useState(true)
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loginForm, setLoginForm] = useState({ username:'', password:'' })
  const [loginError, setLoginError] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [search, setSearch] = useState('')
  const [clientsList, setClientsList] = useState([])
  const [selectedClient, setSelectedClient] = useState('')

  useEffect(()=>{
    const init = async ()=>{
      try{
        const [uRes, aRes] = await Promise.all([axios.get(`${API_BASE}/users`), axios.get(`${API_BASE}/articles`)])
        setUsers(uRes.data); setArticles(aRes.data); setUseApi(true);
      }catch(e){
        setUsers(localUsers.users); setArticles(localArticles.articles); setUseApi(false);
      }
    }
    init()
  }, [])

  useEffect(()=>{
    const uniq = Array.from(new Set(articles.map(a=>a.client))).filter(Boolean)
    setClientsList(uniq)
  }, [articles])

  const handleLogin = async ()=>{
    try{
      if (useApi){
        const res = await axios.post(`${API_BASE}/login`, loginForm)
        setCurrentUser(res.data)
      } else {
        const u = localUsers.findByCredentials(loginForm.username, loginForm.password)
        if (!u) throw new Error('Identifiants invalides')
        setCurrentUser(u)
      }
      setLoginError('')
    }catch(e){ setLoginError(e.response?.data?.error || e.message || 'Erreur') }
  }

  const handleLogout = ()=>{ setCurrentUser(null); setShowOptions(false) }

  const addArticle = async (data)=>{
    if (useApi){
      const res = await axios.post(`${API_BASE}/articles`, data)
      setArticles(prev=>[...prev, res.data])
    } else {
      const a = localArticles.add(data)
      setArticles(localArticles.articles)
    }
  }

  const updateArticle = async (id, patch)=>{
    if (useApi){ await axios.put(`${API_BASE}/articles/${id}`, patch); const newList = await axios.get(`${API_BASE}/articles`); setArticles(newList.data) }
    else { localArticles.update(id, patch); setArticles(localArticles.articles) }
  }

  const deleteArticle = async (id)=>{
    if (!confirm('Confirmer suppression ?')) return
    if (useApi){ await axios.delete(`${API_BASE}/articles/${id}`); const newList = await axios.get(`${API_BASE}/articles`); setArticles(newList.data) }
    else { localArticles.remove(id); setArticles(localArticles.articles) }
  }

  const exportExcelByClient = (client) => {
    const rows = articles.filter(a => a.client === client)
    if (rows.length === 0) { alert('Aucun article pour ce client'); return }
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, client.substring(0,31))
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const fileName = `mrdpstock_${client.replace(/[^a-z0-9]/gi,'_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    saveAs(blob, fileName)
  }

  if (users.length === 0) {
    return <SetupAdmin onCreate={async ({username,password,role})=>{ try{ if (useApi){ await axios.post(`${API_BASE}/register`, {username,password,role}); const uRes = await axios.get(`${API_BASE}/users`); setUsers(uRes.data); setCurrentUser(uRes.data[0]) } else { const u = await localUsers.createUser({username,password,role}); setUsers(localUsers.users); setCurrentUser(u) } }catch(e){ alert(e.response?.data?.error || e.message) } }} />
  }

  if (!currentUser) return <LoginPage form={loginForm} setForm={setLoginForm} onLogin={handleLogin} error={loginError} />

  const filtered = useMemo(()=>articles.filter(a=>
    a.client?.toLowerCase().includes(search.toLowerCase()) ||
    a.reference?.toLowerCase().includes(search.toLowerCase()) ||
    a.designation?.toLowerCase().includes(search.toLowerCase())
  ),[articles,search])

  return (
    <div className="container">
      <TopBar user={currentUser} onOptions={()=>setShowOptions(true)} onLogout={handleLogout} />

      {showOptions && currentUser.role === 'admin' && (
        <div>
          <DatabaseConfig config={{type: useApi ? 'api' : 'local'}} setConfig={()=>{}} onSave={()=>alert('config saved')} />
          <UserManagement users={users} createUser={async (f)=>{ if (useApi){ await axios.post(`${API_BASE}/register`, f); setUsers((await axios.get(`${API_BASE}/users`)).data) } else { await localUsers.createUser(f); setUsers(localUsers.users) } }} updateUser={async (id,patch)=>{ if (useApi) { await axios.delete(`${API_BASE}/users/${id}`); setUsers((await axios.get(`${API_BASE}/users`)).data)} else { updateUser(id,patch) } }} deleteUser={async (id)=>{ if (useApi) { await axios.delete(`${API_BASE}/users/${id}`); setUsers((await axios.get(`${API_BASE}/users`)).data) } else { localUsers.deleteUser(id); setUsers(localUsers.users) } }} />
          <div style={{marginTop:12}}>
            <button className="btn" onClick={()=>setShowOptions(false)}>Retour</button>
          </div>
        </div>
      )}
      {!showOptions && (
        <div>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <input
              type="text"
              className="input"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="">Tous les clients</option>
              {clientsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              className="btn"
              style={{ marginLeft: 10 }}
              onClick={() => setShowArticleForm(true)}
            >
              Ajouter un article
            </button>

            {selectedClient && (
              <button
                className="btn"
                style={{ marginLeft: 10 }}
                onClick={() => exportExcelByClient(selectedClient)}
              >
                Exporter Excel
              </button>
            )}
          </div>

          <ArticleTable
            articles={filtered}
            onEdit={(a) => { setEditingArticle(a); setShowArticleForm(true); }}
            onDelete={deleteArticle}
          />

          {showArticleForm && (
            <ArticleForm
              initial={editingArticle}
              onCancel={() => { setShowArticleForm(false); setEditingArticle(null); }}
              onSave={async (data) => {
                if (editingArticle) await updateArticle(editingArticle.id, data);
                else await addArticle(data);
                setShowArticleForm(false);
                setEditingArticle(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}


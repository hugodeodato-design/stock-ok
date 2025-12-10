import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadJSON, saveJSON } from '../utils/storage'

const KEY = 'mrdp_articles_v1'

export default function useArticles(initial = []) {
  const [articles, setArticles] = useState(() => loadJSON(KEY, initial))
  useEffect(() => saveJSON(KEY, articles), [articles])
  const add = useCallback((data) => { const a = { id: uuidv4(), ...data }; setArticles(prev => [...prev, a]); return a }, [])
  const update = useCallback((id, patch) => { setArticles(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a)) }, [])
  const remove = useCallback((id) => { setArticles(prev => prev.filter(a => a.id !== id)) }, [])
  const replaceAll = useCallback((list) => { setArticles(list) }, [])
  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(articles, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mrdpstock_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [articles])
  return { articles, add, update, remove, replaceAll, exportJSON }
}

import { useState, useEffect, useCallback } from 'react'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { loadJSON, saveJSON } from '../utils/storage'

const KEY = 'mrdp_users_v1'

export default function useUsers() {
  const [users, setUsers] = useState(() => loadJSON(KEY, []))

  useEffect(() => { saveJSON(KEY, users) }, [users])

  const createUser = useCallback(async ({ username, password, role = 'user' }) => {
    const exists = users.find(u => u.username === username)
    if (exists) throw new Error('Utilisateur existe déjà')
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const user = { id: uuidv4(), username, passwordHash: hash, role }
    setUsers(prev => [...prev, user])
    return user
  }, [users])

  const updateUser = useCallback((id, patch) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u)) }, [])
  const deleteUser = useCallback((id) => { setUsers(prev => prev.filter(u => u.id !== id)) }, [])
  const findByCredentials = useCallback((username, password) => {
    const user = users.find(u => u.username === username)
    if (!user) return null
    const ok = bcrypt.compareSync(password, user.passwordHash)
    return ok ? user : null
  }, [users])

  return { users, createUser, updateUser, deleteUser, findByCredentials }
}

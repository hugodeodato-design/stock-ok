import React from 'react'
import { createRoot } from 'react-dom/client'
import GestionStock from './GestionStock'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GestionStock />
  </React.StrictMode>
)

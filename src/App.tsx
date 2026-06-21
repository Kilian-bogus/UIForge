import React, { useState, useEffect } from 'react'
import { Dashboard } from '@/pages/Dashboard'
import { EditorPage } from '@/pages/EditorPage'
import { useI18nStore } from '@/store/i18nStore'


export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard')
  const initI18n = useI18nStore(s => s.init)
  const initialized = useI18nStore(s => s.initialized)

  useEffect(() => {
    initI18n()
  }, [initI18n])

  if (!initialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>
        <p>UIForge wird geladen...</p>
      </div>
    )
  }

  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={(page) => setCurrentPage(page)} />
      )}
      {currentPage === 'editor' && <EditorPage onNavigate={(page) => setCurrentPage(page)} />}
    </>
  )
}

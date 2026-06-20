import React, { useState } from 'react'
import { Dashboard } from '@/pages/Dashboard'
import { EditorPage } from '@/pages/EditorPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard')

  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={(page) => setCurrentPage(page)} />
      )}
      {currentPage === 'editor' && <EditorPage />}
    </>
  )
}

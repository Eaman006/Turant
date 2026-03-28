import React from 'react'
import Sidebar from '../Components/Sidebar'
import Chatbot from '../Components/Chatbot'
import AuthGuard from '../Components/AuthGuard'
import SavedContactsProvider from './SavedContactsProvider'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SavedContactsProvider>
        {/* Sidebar is `fixed` inside the component, so it will remain visible across /home/* routes */}
        <Sidebar />
        <div className="ml-28 mr-10 pt-10">{children}</div>
        <Chatbot />
      </SavedContactsProvider>
    </AuthGuard>
  )
}


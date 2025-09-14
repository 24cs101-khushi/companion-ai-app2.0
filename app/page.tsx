"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { ChatPage } from "@/components/chat-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const authStatus = localStorage.getItem("companion-ai-auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    localStorage.setItem("companion-ai-auth", "true")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("companion-ai-auth")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {isAuthenticated ? <ChatPage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </main>
  )
}

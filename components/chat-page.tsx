"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bot, User, Send, Menu, LogOut, FileText, Settings, Info, Upload, X, File } from "lucide-react"

interface ChatPageProps {
  onLogout: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  attachments?: { name: string; type: string; size: number }[]
}

interface UploadedFile {
  name: string
  type: string
  size: number
  content: string
}

export function ChatPage({ onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Companion AI, your intelligent assistant for appliance troubleshooting and maintenance. You can also upload PDF manuals or documents for me to analyze. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("chat")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf" || file.type.startsWith("text/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            name: file.name,
            type: file.type,
            size: file.size,
            content: e.target?.result as string,
          }
          setUploadedFiles((prev) => [...prev, newFile])

          const fileMessage: Message = {
            id: Date.now().toString(),
            content: `I've uploaded "${file.name}" for analysis.`,
            sender: "user",
            timestamp: new Date(),
            attachments: [{ name: file.name, type: file.type, size: file.size }],
          }
          setMessages((prev) => [...prev, fileMessage])

          setTimeout(() => {
            const botResponse: Message = {
              id: (Date.now() + 1).toString(),
              content: `Great! I've received your document "${file.name}". I can now help you with questions about this manual or document. What specific information are you looking for?`,
              sender: "bot",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botResponse])
          }, 1000)
        }
        reader.readAsText(file)
      }
    })

    setShowUploadModal(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputMessage}". ${
          uploadedFiles.length > 0
            ? `Based on the documents you've uploaded (${uploadedFiles.map((f) => f.name).join(", ")}), I can provide more specific guidance. `
            : ""
        }As your Companion AI, I can help you troubleshoot appliances, provide maintenance tips, and guide you through repairs. Could you tell me more about the specific appliance or issue you're experiencing?`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const renderContent = () => {
    switch (currentPage) {
      case "profile":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
            <Card className="glass-dark border-white/20 p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm">Name</label>
                  <Input className="mt-1 bg-white/10 border-white/20 text-white" defaultValue="Demo User" />
                </div>
                <div>
                  <label className="text-white/80 text-sm">Email</label>
                  <Input className="mt-1 bg-white/10 border-white/20 text-white" defaultValue="demo@example.com" />
                </div>
                <Button className="bg-primary hover:bg-primary/80 text-white">Save Changes</Button>
              </div>
            </Card>
          </div>
        )
      case "about":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">About Companion AI</h2>
            <Card className="glass-dark border-white/20 p-6">
              <div className="space-y-4 text-white/80">
                <p>
                  Companion AI is your intelligent assistant designed specifically for appliance troubleshooting and
                  maintenance.
                </p>
                <p>Our AI can help you with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Diagnosing appliance issues</li>
                  <li>Providing step-by-step repair guides</li>
                  <li>Maintenance scheduling and reminders</li>
                  <li>Safety tips and precautions</li>
                  <li>Parts identification and sourcing</li>
                  <li>Analyzing uploaded PDF manuals and documents</li>
                </ul>
                <p className="text-sm text-white/60 mt-6">Version 1.0.0 - Built with advanced AI technology</p>
              </div>
            </Card>
          </div>
        )
      default:
        return (
          <div className="flex-1 flex flex-col">
            {uploadedFiles.length > 0 && (
              <div className="p-4 border-b border-white/10">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 glass-dark border-white/20 rounded-lg px-3 py-2"
                    >
                      <File className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-auto p-1 text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 glass rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.sender === "user" ? "bg-primary text-white" : "glass-dark border-white/20 text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.attachments && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-white/70">
                            <FileText className="w-3 h-3" />
                            <span>{attachment.name}</span>
                            <span>({(attachment.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-60 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-dark border-white/20 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about your appliances..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-primary hover:bg-primary/80 text-white"
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="glass-dark border-white/20 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Document</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUploadModal(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                Upload PDF manuals, text files, or documents for AI analysis and assistance.
              </p>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                <p className="text-white/60 text-sm mb-4">Drag and drop files here, or click to browse</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-white/50">Supported formats: PDF, TXT, DOC, DOCX</p>
            </div>
          </Card>
        </div>
      )}

      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 glass-dark border-r border-white/10 flex flex-col`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Button
            variant={currentPage === "chat" ? "secondary" : "ghost"}
            className={`w-full justify-start text-white hover:bg-white/10 ${!sidebarOpen && "px-2"}`}
            onClick={() => setCurrentPage("chat")}
          >
            <Bot className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Chat</span>}
          </Button>
          <Button
            variant={currentPage === "profile" ? "secondary" : "ghost"}
            className={`w-full justify-start text-white hover:bg-white/10 ${!sidebarOpen && "px-2"}`}
            onClick={() => setCurrentPage("profile")}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Profile</span>}
          </Button>
          <Button
            variant={currentPage === "about" ? "secondary" : "ghost"}
            className={`w-full justify-start text-white hover:bg-white/10 ${!sidebarOpen && "px-2"}`}
            onClick={() => setCurrentPage("about")}
          >
            <Info className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">About</span>}
          </Button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/10 ${!sidebarOpen && "px-2"}`}
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-16 glass-dark border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold gradient-text">
              {currentPage === "chat" ? "Companion AI" : currentPage === "profile" ? "Profile Settings" : "About"}
            </h1>
          </div>
          {currentPage === "chat" && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => setShowUploadModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          )}
        </header>

        {renderContent()}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Markdown from 'react-markdown'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setFeedback('')
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/feedback', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setFeedback(data.feedback)
    } catch (error) {
      setFeedback('Error: Failed to get feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '0 2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem 0'
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#1a1a1a',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>AI Comic Art Studio</h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>Get professional feedback on your comic art from our AI instructor, focusing on anatomy and perspective.</p>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: preview ? '1fr 1fr' : '1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        <div>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? '#2563eb' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: dragActive ? '#f0f9ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: 'none'
                }}
                id="file-input"
              />
              <label htmlFor="file-input" style={{
                cursor: 'pointer',
                display: 'block'
              }}>
                <div style={{
                  marginBottom: '1rem',
                  color: '#64748b',
                  fontSize: '1.1rem'
                }}>
                  {preview ? '🖼️ Change Image' : '📁 Drop your artwork here or click to browse'}
                </div>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <div style={{
                    color: '#94a3b8',
                    marginTop: '1rem'
                  }}>
                    Supports: PNG, JPG, GIF
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '500',
                cursor: file && !loading ? 'pointer' : 'not-allowed',
                opacity: file && !loading ? 1 : 0.7,
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(37,99,235,0.1)',
                transform: file && !loading ? 'translateY(0)' : 'none',
                ':hover': {
                  transform: file && !loading ? 'translateY(-1px)' : 'none',
                  boxShadow: '0 4px 6px rgba(37,99,235,0.2)'
                }
              }}
            >
              {loading ? 'Analyzing Artwork...' : 'Get Professional Feedback'}
            </button>
          </form>
        </div>

        {(feedback || loading) && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              marginBottom: '1.5rem',
              color: '#1a1a1a',
              fontWeight: '600'
            }}>Professional Feedback</h2>
            {loading ? (
              <div style={{ 
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  border: '2px solid #e5e7eb',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analyzing your artwork...
              </div>
            ) : (
              <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: '#374151'
              }}>
                <Markdown
                  components={{
                    p: ({node, ...props}) => (
                      <p style={{marginBottom: '1rem'}} {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginTop: '1.5rem',
                        marginBottom: '0.75rem',
                        color: '#1f2937'
                      }} {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul style={{
                        marginBottom: '1rem',
                        paddingLeft: '1.5rem'
                      }} {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li style={{
                        marginBottom: '0.5rem'
                      }} {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong style={{
                        color: '#1f2937',
                        fontWeight: '600'
                      }} {...props} />
                    )
                  }}
                >
                  {feedback}
                </Markdown>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
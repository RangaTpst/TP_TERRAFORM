'use client'

import { useEffect, useRef, useState } from 'react'

type FileItem = { name: string; date: string; size: number }

export default function StorageClient() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function loadFiles() {
    const res = await fetch('/api/s3/files')
    if (res.ok) setFiles(await res.json())
  }

  useEffect(() => { loadFiles() }, [])

  async function handleUpload() {
    console.log('handleUpload', inputRef.current?.files)
    const file = inputRef.current?.files?.[0]
    if (!file) { setStatus('Veuillez sélectionner un fichier'); return }
    setStatus('Upload en cours...')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/s3/upload', { method: 'POST', body: form })
    if (res.ok) {
      const data = await res.json()
      setStatus(`✓ ${data.name} uploadé (${(data.size / 1024).toFixed(1)} Ko)`)
      loadFiles()
    } else {
      setStatus('Erreur lors de l\'upload')
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer tous les fichiers du bucket principal ?')) return
    setStatus('Suppression en cours...')
    const res = await fetch('/api/s3/delete', { method: 'DELETE' })
    if (res.ok) {
      const data = await res.json()
      setStatus(data.message ?? `✓ ${data.deleted} fichier(s) supprimé(s)`)
      loadFiles()
    } else {
      setStatus('Erreur lors de la suppression')
    }
  }

  async function handleRestore() {
    if (!confirm('Restaurer le bucket froid vers le bucket principal ?')) return
    setStatus('Restauration en cours...')
    const res = await fetch('/api/s3/restore', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setStatus(data.message ?? `✓ ${data.restored} fichier(s) restauré(s)`)
      loadFiles()
    } else {
      setStatus('Erreur lors de la restauration')
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-8">Stockage S3</h1>

      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Upload</h2>
        <div className="flex gap-3 items-center">
          <input ref={inputRef} type="file" className="flex-1" />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-black text-white rounded hover:bg-zinc-700"
          >
            Envoyer
          </button>
        </div>
        {status && <p className="mt-3 text-sm text-zinc-600">{status}</p>}
      </section>

      <section className="mb-8 p-6 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fichiers ({files.length})</h2>
            <div className="flex gap-2">
            <button onClick={loadFiles} className="text-sm text-zinc-500 hover:text-black">
              Rafraîchir
            </button>
            <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">
              Tout supprimer
            </button>
          </div>
        </div>
        {files.length === 0 ? (
          <p className="text-zinc-400 text-sm">Aucun fichier</p>
        ) : (
          <ul className="divide-y">
            {files.map((f) => (
              <li key={f.name} className="py-2 flex justify-between text-sm">
                <span className="font-medium">{f.name}</span>
                <span className="text-zinc-400">
                  {new Date(f.date).toLocaleDateString()} — {(f.size / 1024).toFixed(1)} Ko
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="p-6 border rounded-lg border-red-200">
        <h2 className="text-lg font-semibold mb-2">Restauration</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Copie tous les fichiers du bucket froid vers le bucket principal.
        </p>
        <button
          onClick={handleRestore}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Restaurer depuis le backup
        </button>
      </section>
    </main>
  )
}

"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { useCallback, useRef } from "react"
import EditorToolbar from "./EditorToolbar"

interface RichTextEditorProps {
  initialContent?: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ initialContent = "", onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "Begin your story here..." }),
    ],
    content: initialContent,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !editor) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) throw new Error("Upload failed")
        const { url } = await res.json()
        editor.chain().focus().setImage({ src: url }).run()
      } catch (err) {
        console.error("Image upload error:", err)
        alert("Image upload failed. Please try again.")
      }

      e.target.value = ""
    },
    [editor]
  )

  if (!editor) return null

  return (
    <div className="neo-border bg-white">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

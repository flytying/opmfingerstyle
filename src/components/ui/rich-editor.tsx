"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          title="Bold"
          className="font-bold"
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          title="Italic"
          className="italic"
        />
        <div className="mx-1 w-px bg-border" />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="H2"
          title="Heading 2"
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="H3"
          title="Heading 3"
        />
        <div className="mx-1 w-px bg-border" />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="&bull;"
          title="Bullet List"
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1."
          title="Numbered List"
        />
        <div className="mx-1 w-px bg-border" />
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="&ldquo;"
          title="Quote"
        />
        <ToolbarButton
          active={false}
          onClick={() => {
            const url = window.prompt("Enter link URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          label="🔗"
          title="Add Link"
        />
        <ToolbarButton
          active={false}
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          label="🖼"
          title="Add Image"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  title,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm transition-colors ${className} ${
        active
          ? "bg-foreground text-background"
          : "text-muted hover:bg-gray-200"
      }`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}

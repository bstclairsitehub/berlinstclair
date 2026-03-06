'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useCallback } from 'react';

interface TiptapEditorProps {
  content?: any;
  onChange: (json: any) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent focus loss from the editor on toolbar click
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={[
        'px-2.5 py-1.5 font-sans text-xs border transition-colors select-none',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        isActive
          ? 'bg-dp-text text-dp-bg border-dp-text'
          : 'bg-dp-surface text-dp-text border-dp-border hover:border-dp-text',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-dp-border mx-0.5" aria-hidden="true" />;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'max-w-full h-auto my-4' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-dp-blue underline' },
      }),
    ],
    content: content ?? '',
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: [
          'prose prose-lg max-w-none focus:outline-none',
          'font-body text-dp-text text-base leading-relaxed',
          'min-h-[400px] p-4',
        ].join(' '),
      },
    },
  });

  // Sync external content prop (e.g. when initialData loads async)
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, JSON.stringify(content)]);

  const addImage = useCallback(() => {
    if (typeof window === 'undefined' || !editor) return;
    const url = window.prompt('Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL:', previousUrl ?? '');
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-dp-border rounded-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-dp-elevated border-b border-dp-border sticky top-0 z-10">
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          {'<>'}
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          &bull; List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          1. List
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          &ldquo;&nbsp;&rdquo;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          Code
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          &mdash;
        </ToolbarButton>

        <ToolbarDivider />

        {/* Links & images */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Add / Edit Link"
        >
          Link
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image by URL">
          Image
        </ToolbarButton>

        <ToolbarDivider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          &larr; Undo
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          Redo &rarr;
        </ToolbarButton>
      </div>

      {/* ── Editor area ── */}
      <div className="bg-dp-surface">
        <EditorContent editor={editor} />
      </div>

      {/* ── Status bar ── */}
      <div className="border-t border-dp-border px-3 py-1.5 bg-dp-elevated flex items-center justify-between">
        <span className="font-sans text-xs text-dp-text-muted uppercase tracking-wide">
          {editor.isActive('heading', { level: 1 }) && 'Heading 1'}
          {editor.isActive('heading', { level: 2 }) && 'Heading 2'}
          {editor.isActive('heading', { level: 3 }) && 'Heading 3'}
          {editor.isActive('paragraph') && 'Paragraph'}
          {editor.isActive('blockquote') && 'Blockquote'}
          {editor.isActive('codeBlock') && 'Code Block'}
          {editor.isActive('bulletList') && 'Bullet List'}
          {editor.isActive('orderedList') && 'Ordered List'}
        </span>
        <span className="font-sans text-xs text-dp-text-muted">
          {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Scoped prose styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ProseMirror { outline: none; }
            .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin: 1em 0 0.5em; line-height: 1.2; }
            .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 1em 0 0.4em; line-height: 1.3; }
            .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin: 0.8em 0 0.3em; line-height: 1.35; }
            .ProseMirror p { margin-bottom: 1em; }
            .ProseMirror blockquote { border-left: 3px solid #1A1A1A; padding-left: 1rem; margin: 1.25em 0; font-style: italic; }
            .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1em; }
            .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1em; }
            .ProseMirror li { margin-bottom: 0.3em; }
            .ProseMirror code { font-family: monospace; font-size: 0.875em; background: #F7F7F7; border: 1px solid #DFDFDF; padding: 0.1em 0.35em; border-radius: 2px; }
            .ProseMirror pre { background: #F7F7F7; border: 1px solid #DFDFDF; padding: 1rem; overflow-x: auto; margin-bottom: 1em; }
            .ProseMirror pre code { background: none; border: none; padding: 0; }
            .ProseMirror a { color: #326891; text-decoration: underline; }
            .ProseMirror hr { border: none; border-top: 2px solid #1A1A1A; margin: 2em 0; }
            .ProseMirror img { max-width: 100%; height: auto; margin: 1em 0; }
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #aaa;
              pointer-events: none;
              height: 0;
            }
          `,
        }}
      />
    </div>
  );
}

import React from 'react'
import type { TiptapNode, TiptapDoc } from '@/lib/types'

function applyMarks(text: string, marks?: TiptapNode['marks']): React.ReactNode {
  if (!marks || marks.length === 0) return text
  return marks.reduce<React.ReactNode>((node, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{node}</strong>
      case 'italic':
        return <em>{node}</em>
      case 'code':
        return <code className="font-mono bg-dp-elevated px-1 rounded text-sm text-dp-text">{node}</code>
      case 'link':
        return (
          <a
            href={mark.attrs?.href}
            target={mark.attrs?.target ?? '_blank'}
            rel="noopener noreferrer"
            className="text-dp-blue underline hover:no-underline"
          >
            {node}
          </a>
        )
      default:
        return node
    }
  }, text)
}

function renderNode(node: TiptapNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return (
        <React.Fragment key={index}>
          {applyMarks(node.text ?? '', node.marks)}
        </React.Fragment>
      )

    case 'paragraph':
      return (
        <p key={index} className="mb-4 leading-relaxed break-inside-avoid">
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case 'heading': {
      const level = node.attrs?.level ?? 2
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const sizeMap: Record<number, string> = {
        1: 'text-4xl font-bold mt-8 mb-4',
        2: 'text-3xl font-bold mt-6 mb-3',
        3: 'text-2xl font-semibold mt-5 mb-2',
        4: 'text-xl font-semibold mt-4 mb-2',
        5: 'text-lg font-semibold mt-3 mb-1',
        6: 'text-base font-semibold mt-3 mb-1',
      }
      return (
        <Tag
          key={index}
          className={`font-headline column-span-all break-inside-avoid ${sizeMap[level] ?? ''}`}
          style={{ columnSpan: 'all' }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }

    case 'bulletList':
      return (
        <ul key={index} className="list-disc list-inside mb-4 space-y-1 break-inside-avoid">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case 'orderedList':
      return (
        <ol key={index} className="list-decimal list-inside mb-4 space-y-1 break-inside-avoid">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case 'listItem':
      return (
        <li key={index} className="leading-relaxed">
          {node.content?.map((child, i) =>
            child.type === 'paragraph'
              ? child.content?.map((c, j) => renderNode(c, j))
              : renderNode(child, i)
          )}
        </li>
      )

    case 'blockquote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-dp-text pl-6 my-6 italic font-body text-xl leading-relaxed break-inside-avoid column-span-all"
          style={{ columnSpan: 'all' }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case 'codeBlock':
      return (
        <pre
          key={index}
          className="bg-dp-elevated text-dp-text rounded p-4 overflow-x-auto mb-4 font-mono text-sm break-inside-avoid"
        >
          <code>{node.content?.map((child, i) => renderNode(child, i))}</code>
        </pre>
      )

    case 'image':
      return (
        <figure key={index} className="my-6 break-inside-avoid column-span-all" style={{ columnSpan: 'all' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.attrs?.src}
            alt={node.attrs?.alt ?? ''}
            className="w-full h-auto object-cover"
          />
          {node.attrs?.title && (
            <figcaption className="text-xs text-dp-text-muted font-sans mt-1 text-center uppercase tracking-wide">
              {node.attrs.title}
            </figcaption>
          )}
        </figure>
      )

    case 'hardBreak':
      return <br key={index} />

    case 'horizontalRule':
      return <hr key={index} className="my-6 border-dp-border" />

    default:
      return null
  }
}

export function TiptapRenderer({ content }: { content: any }) {
  if (!content) return null
  const doc = content as TiptapDoc
  if (!doc.content) return null

  return (
    <>
      {doc.content.map((node, i) => renderNode(node, i))}
    </>
  )
}

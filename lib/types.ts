export type PostWithRelations = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: any
  heroImage: string | null
  published: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  }
  tags: {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

export type CategoryWithCount = {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export type TiptapNode = {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  text?: string
  marks?: {
    type: string
    attrs?: Record<string, any>
  }[]
}

export type TiptapDoc = {
  type: 'doc'
  content: TiptapNode[]
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TIPTAP_ARTICLE = (paragraphs: string[]) => ({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: paragraphs[0] }],
    },
    ...paragraphs.slice(1).map((p) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: p }],
    })),
  ],
})

async function main() {
  console.log('Seeding database...')

  // Remove old categories and their posts
  const oldSlugs = ['world', 'politics', 'technology', 'science', 'arts']
  for (const slug of oldSlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } })
    if (cat) {
      // Delete tags on posts, then posts, then category
      const posts = await prisma.post.findMany({ where: { categoryId: cat.id }, select: { id: true } })
      for (const post of posts) {
        await prisma.tagsOnPosts.deleteMany({ where: { postId: post.id } })
      }
      await prisma.post.deleteMany({ where: { categoryId: cat.id } })
      await prisma.category.delete({ where: { slug } })
    }
  }
  // Also remove old tags
  const oldTags = ['breaking', 'analysis', 'opinion']
  for (const slug of oldTags) {
    const tag = await prisma.tag.findUnique({ where: { slug } })
    if (tag) {
      await prisma.tagsOnPosts.deleteMany({ where: { tagId: tag.id } })
      await prisma.tag.delete({ where: { slug } })
    }
  }

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'gay-storytime' }, update: {}, create: { name: 'Gay Storytime', slug: 'gay-storytime' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion' } }),
    prisma.category.upsert({ where: { slug: 'music' }, update: {}, create: { name: 'Music I\'m Listening To', slug: 'music' } }),
  ])

  const [gayStorytime, fashion, music] = categories

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'feature' }, update: {}, create: { name: 'Feature', slug: 'feature' } }),
    prisma.tag.upsert({ where: { slug: 'personal' }, update: {}, create: { name: 'Personal', slug: 'personal' } }),
    prisma.tag.upsert({ where: { slug: 'style' }, update: {}, create: { name: 'Style', slug: 'style' } }),
    prisma.tag.upsert({ where: { slug: 'playlist' }, update: {}, create: { name: 'Playlist', slug: 'playlist' } }),
  ])

  const [feature, personal, style, playlist] = tags

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thedailygay.com' },
    update: {},
    create: {
      name: 'Editor in Chief',
      email: 'admin@thedailygay.com',
      role: 'ADMIN',
    },
  })

  // Articles
  const articles = [
    {
      title: 'Coming Out at Twenty-Five: My Journey to Authentic Living',
      slug: 'coming-out-my-journey',
      excerpt: 'A personal essay about finding courage, embracing my true self, and the family moments that made it possible.',
      heroImage: 'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=1200&q=80',
      categoryId: gayStorytime.id,
      content: TIPTAP_ARTICLE([
        'Coming Out at Twenty-Five: My Journey to Authentic Living',
        'I spent most of my twenties constructing an elaborate architecture of pretense. Not maliciously—I wasn\'t lying to hurt anyone. I was lying to survive. I told myself that I would come out when I was ready, when I was older, when circumstances were perfect. Mostly, I didn\'t tell myself anything at all. I just lived in the quiet terror of being discovered.',
        'My parents are good people. They\'re loving and supportive, or at least they try to be. But they\'re also products of their time, shaped by the stories they were told about what normal looks like. Normal, in their worldview, included a heterosexual marriage and grandchildren. It didn\'t include me as I actually am.',
        'The night I finally told them, I was shaking so hard I could barely hold my phone. I was calling from my apartment across the country, a coward\'s method, but it was the only way I could find the words. My mother cried. Not angry tears—confused tears. My father said nothing for a long moment. Then he asked if I was happy. That one question shifted something in me.',
        '"I will be," I told him, "if you let me."',
        'Coming out wasn\'t a single moment of revelation that fixed everything. It was the beginning of a long, tender conversation about love, acceptance, and what it means to see your child clearly. Three years later, my parents attended Pride with me. I watched my father hold a rainbow flag and something in his face changed—a softening, an opening.',
        'Now, at twenty-eight, I can say with absolute certainty that I am happier than I\'ve ever been. Not because of who I love, though that\'s part of it. But because I\'m finally living in a way that doesn\'t require me to disappear.',
      ]),
      tagIds: [feature.id, personal.id],
      publishedAt: new Date('2026-03-05T09:00:00Z'),
    },
    {
      title: 'Queerness in Found Family: How I Built My Chosen Family',
      slug: 'queerness-found-family',
      excerpt: 'An exploration of the chosen families that queer people create when biological family isn\'t safe, and what it means to belong.',
      heroImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
      categoryId: gayStorytime.id,
      content: TIPTAP_ARTICLE([
        'Queerness in Found Family: How I Built My Chosen Family',
        'There\'s a photo from my twenty-first birthday that I treasure more than any photo from my childhood. It\'s not professionally lit. It\'s not perfectly composed. But it shows me surrounded by people who chose me—and whom I chose back. These are the people I call my family now.',
        'Growing up in a conservative town meant that queerness was something you felt in isolation. I didn\'t have language for it until college. I didn\'t have community until I learned to look for it. But once I found those first friends—the ones who understood without me having to explain, the ones whose eyes lit up when I walked in the room—I realized I was building something my nuclear family couldn\'t provide: a space where I could be completely, unapologetically myself.',
        'Found family is both a privilege and a necessity in queer life. For many of us, it\'s the difference between survival and flourishing. It\'s the shoulder to cry on when your mother doesn\'t understand. It\'s the celebration when no one else will witness your joy. It\'s the net that catches you when everything else falls apart.',
        'My found family now includes my best friend from college (with whom I call each other every single day), two roommates who\'ve become brothers, an older queer mentor who guides me through career decisions, and a surprisingly supportive coworker who became my closest confidant. None of them are biologically related to me. All of them are irreplaceable.',
        'I think often about the privilege of being able to build this family intentionally, to choose people based on values rather than accident of birth. It\'s something I don\'t take for granted. Because I know not everyone gets to have this—the safety, the celebration, the unwavering presence of people who love them fully.',
      ]),
      tagIds: [personal.id, feature.id],
      publishedAt: new Date('2026-03-03T10:00:00Z'),
    },
    {
      title: 'Spring Capsule Wardrobe: Minimalist Essentials for Maximum Versatility',
      slug: 'spring-capsule-wardrobe',
      excerpt: 'A curated collection of eight pieces that mix and match to create twenty-plus spring outfits. Minimal waste, maximum style.',
      heroImage: 'https://images.unsplash.com/photo-1515564276664-6e5ecc341f17?w=1200&q=80',
      categoryId: fashion.id,
      content: TIPTAP_ARTICLE([
        'Spring Capsule Wardrobe: Minimalist Essentials for Maximum Versatility',
        'Spring is the perfect time to reset your closet. The weather is unpredictable enough that you need layers, but warm enough that you can finally put away the heavy coats. I\'ve spent the last season experimenting with a minimal capsule wardrobe, and I\'ve found that you really don\'t need much to feel put-together.',
        'The foundation of my spring capsule is six core pieces: a white linen shirt, cream straight-leg trousers, a butter-yellow linen blazer, a lightweight striped sweater, dark denim, and a khaki linen dress. Everything is neutral or soft-colored, which makes mixing and matching effortless. Everything is also quality enough to last multiple seasons.',
        'From there, I add a few accent pieces: a vintage leather belt (thrifted, natural wear adds character), a camel-colored cardigan for layering, and two patterned pieces for visual interest. Surprisingly, this is everything I need to get through an entire season without repeating an outfit twice.',
        'The real magic is in the accessories. A white silk scarf elevated the same cream trousers three different ways. A vintage gold watch grounds a look. A simple gold necklace works with literally everything. These small touches create outfits that feel considered and intentional without requiring an extensive wardrobe.',
        'The bonus? When you have fewer pieces, you take better care of them. You notice which items actually work for your lifestyle, and you invest in better quality. It\'s not minimalism for the sake of aesthetics—it\'s minimalism that actually serves you.',
      ]),
      tagIds: [style.id, feature.id],
      publishedAt: new Date('2026-03-04T14:00:00Z'),
    },
    {
      title: 'Thrifting in Tokyo: Where to Find Vintage Fashion in Shibuya and Beyond',
      slug: 'thrifting-tokyo',
      excerpt: 'A lookbook and guide to Tokyo\'s best vintage and thrift shops, featuring pieces I found and styled for travel.',
      heroImage: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1200&q=80',
      categoryId: fashion.id,
      content: TIPTAP_ARTICLE([
        'Thrifting in Tokyo: Where to Find Vintage Fashion in Shibuya and Beyond',
        'Tokyo is a thrifter\'s dream. The city has a deep culture of caring for clothing, which means the vintage and secondhand market is exceptional. Even better, the fashion sensibility is entirely different from Western markets—you\'re likely to find pieces that feel fresh and unexpected.',
        'My favorite find was at a tiny shop in Harajuku called Vintage Heaven. It\'s hidden on the third floor of a nondescript building, and if you don\'t know to look for it, you\'ll never find it. I discovered a 1970s Issey Miyake blouse in perfect condition. It\'s oversized, asymmetrical, and completely impractical for everyday wear. I wear it constantly.',
        'The second piece I fell in love with was a pair of vintage Levi\'s from the 1980s. They were stiff at first, but after a few washes they softened into the perfect worn-in fit. Styled with a simple white tank and the Issey Miyake blouse, they become something special—the kind of look that makes you feel like you understand something about fashion that most people don\'t.',
        'I also scored a vintage gold lamé jacket that I wasn\'t sure about until I found the perfect context for it. Worn with black trousers and pointed-toe heels, it becomes evening wear. Worn with wide-leg denim and sneakers, it becomes a statement piece.',
        'The lesson I learned from Tokyo thrifting is that the best pieces aren\'t always about brand names or perfection. They\'re about uniqueness and character. They\'re about finding something that speaks to you and then styling it with intention. That\'s how you develop a personal style that actually feels like yours.',
      ]),
      tagIds: [style.id, personal.id],
      publishedAt: new Date('2026-03-02T11:00:00Z'),
    },
    {
      title: 'March Playlist: New Girl Summer Energy (In Winter)',
      slug: 'march-playlist-new-girl-energy',
      excerpt: 'A carefully curated playlist featuring emerging indie artists, nostalgic pop gems, and unexpected covers. Perfect for a season of renewal.',
      heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      categoryId: music.id,
      content: TIPTAP_ARTICLE([
        'March Playlist: New Girl Summer Energy (In Winter)',
        'I\'ve been obsessed with putting together a playlist that captures a very specific mood: the optimism of spring, the nostalgia of beloved pop songs, and the discovery of new artists who feel like hidden gems. This is what I\'ve been listening to on repeat.',
        'The playlist opens with "Motion Sickness" by Phoebe Bridgers because if you\'re starting a mood board in song form, why not start with modern indie perfection? From there, it flows into "Flowers" by The Optic Nerve, a track that\'s both contemporary and timeless. These opening songs set the tone: introspective but hopeful.',
        'I\'ve layered in some nostalgic moments—"Home" by Edward Sharpe & The Magnetic Zeros, because sometimes you need a song that sounds like it was made for a sunset. I\'ve also included recent discoveries like Luna Luna\'s "Crimson," a track that sounds like what love feels like when you\'re learning to receive it.',
        'The middle of the playlist is where things get interesting. I\'ve tucked in a surprising cover of "Don\'t Stop Believin\'," but not the Journey version you\'re expecting—it\'s by a singer-songwriter named Allie Rowbottom, and it\'s intimate and stripped back. There\'s also a completely unexpected orchestral remix of a Lizzo song that somehow works.',
        'The playlist closes with Bon Iver\'s "Holocene," a song about smallness and perspective that feels right for this moment in the year. It\'s the kind of song that makes you feel like you\'re floating, like you\'re part of something larger than yourself. Which, I think, is what we all need right now.',
      ]),
      tagIds: [playlist.id, feature.id],
      publishedAt: new Date('2026-03-01T09:00:00Z'),
    },
    {
      title: 'Fall Listening 2025: From Frank Ocean to Boygenius',
      slug: 'fall-listening-2025',
      excerpt: 'An exploration of the albums that defined my autumn, from emotional ballads to indie rock anthems. Plus recommendations for what to listen to next.',
      heroImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80',
      categoryId: music.id,
      content: TIPTAP_ARTICLE([
        'Fall Listening 2025: From Frank Ocean to Boygenius',
        'Autumn has always been my favorite season for music. Maybe it\'s the slower pace, the change in light, the way the world feels more introspective. Or maybe it\'s that certain albums just hit different when the leaves are turning and there\'s a chill in the air.',
        'This year, I\'ve been living in Frank Ocean\'s music. Not just the recent releases—I\'ve been going back through his catalog, finding new layers in songs I thought I knew. There\'s something about October nights that makes "Ivy" feel like it was written specifically for you.',
        'Boygenius released new material this year, and every track is a masterpiece of emotional complexity. The harmonies make me cry. The lyrics feel like they were written by someone who understands the specific loneliness of being alive in 2025. I\'ve listened to their album approximately eight hundred times.',
        'I\'ve also been exploring some newer artists who are making waves. The Japanese artist Ryo Noda has a debut that feels like folk meets experimental electronic. There\'s an artist named Samara Joy who has a voice that could stop time. These are the artists I think you should be paying attention to.',
        'The best part about fall music is that it doesn\'t have to be melancholy. Yes, there\'s room for sadness. But there\'s also room for hope, for beauty, for the kind of music that makes you feel less alone. That\'s the autumn playlist I\'ve been building.',
      ]),
      tagIds: [playlist.id, personal.id],
      publishedAt: new Date('2026-02-28T14:00:00Z'),
    },
  ]

  for (const article of articles) {
    const { tagIds, ...data } = article
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        published: true,
        authorId: admin.id,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    })
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

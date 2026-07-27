import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'

/**
 * Resolves [[slug]] cross-references in the markdown into real links.
 *
 * The guides use [[slug]] so they stay readable and portable as plain
 * markdown files (see README content conventions). This rewrites them to
 * [Title](/slug) before Content parses the file, so the site gets proper
 * links carrying the target's real title.
 *
 * A [[slug]] with no matching file is left as literal text rather than
 * becoming a dead link — the README treats those as a marker for a guide
 * still to be written.
 */
export default defineNuxtModule({
  meta: { name: 'wiki-links' },
  setup(_options, nuxt) {
    const contentDir = join(nuxt.options.rootDir, 'content')

    // Read every title up front: a guide may link to one parsed later, so
    // building this map inside the parse hook would drop those links.
    const titles = new Map<string, string>()
    for (const name of readdirSync(contentDir)) {
      if (!name.endsWith('.md')) continue
      const raw = readFileSync(join(contentDir, name), 'utf8')
      // Match `title:` anywhere in the frontmatter block, including as its
      // very first line — which is where it actually sits in these files.
      const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]
      const title = frontmatter?.match(/^title:\s*(.+?)\s*$/m)?.[1]
      if (title) titles.set(name.replace(/\.md$/, ''), title.replace(/^["']|["']$/g, ''))
    }

    if (!titles.size) {
      // Silence here would ship a site full of literal [[slug]] text.
      console.warn('[wiki-links] no titles found in content/ — links will not resolve')
    }

    nuxt.hook('content:file:beforeParse', (ctx: any) => {
      const { file } = ctx
      if (!file.id?.endsWith('.md')) return
      const slug = file.id.replace(/^.*\//, '').replace(/\.md$/, '')

      file.body = file.body.replace(/\[\[([a-zA-Z0-9-]+)\]\]/g, (whole: string, target: string) => {
        const key = target.toLowerCase()
        const title = titles.get(key)
        if (!title) return whole
        // Self-links read oddly mid-sentence; keep the name, drop the link.
        return key === slug ? title : `[${title}](/${key})`
      })
    })
  },
})

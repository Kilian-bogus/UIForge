import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const app = express()
  const PORT = process.env.PORT || 3004
  const JWT_SECRET = 'uiforge-secret-key-2024'

  const dataFile = path.join(__dirname, 'uiforge-data.json')

  let data = {
    users: [],
    projects: [],
    pages: [],
    components: [],
    media: [],
  }

  function loadData() {
    try {
      if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile, 'utf8')
        data = JSON.parse(raw)
      }
    } catch (e) {
      console.error('Error loading data:', e.message)
    }
  }

  function saveData() {
    try {
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8')
    } catch (e) {
      console.error('Error saving data:', e.message)
    }
  }

  loadData()
  console.log('Data file:', dataFile)

  let serveFrontend = false
  let staticDir = ''

  for (const dir of [path.join(__dirname, 'dist')]) {
    try {
      if (fs.existsSync(path.join(dir, 'index.html'))) {
        staticDir = dir
        serveFrontend = true
        break
      }
    } catch (e) {}
  }

  app.use(cors())
  app.use(express.json({ limit: '10mb' }))

  function auth(req, res, next) {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ error: 'No token provided' })
    try {
      const token = header.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()
    } catch {
      res.status(401).json({ error: 'Invalid token' })
    }
  }

  // ---- AUTH ----
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password } = req.body
      const existing = data.users.find(u => u.email === email || u.username === username)
      if (existing) return res.status(400).json({ error: 'User already exists' })

      const hashed = await bcrypt.hash(password, 10)
      const id = uuidv4()
      data.users.push({ id, username, email, password: hashed, role: 'editor', created_at: new Date().toISOString() })
      saveData()

      const token = jwt.sign({ id, username, email, role: 'editor' }, JWT_SECRET, { expiresIn: '7d' })
      res.json({ user: { id, username, email, role: 'editor' }, token })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body
      const user = data.users.find(u => u.email === email)
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(401).json({ error: 'Invalid credentials' })

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.get('/api/auth/me', auth, (req, res) => {
    const user = data.users.find(u => u.id === req.user.id)
    if (!user) return res.status(404).json({ error: 'Not found' })
    const { password, ...safe } = user
    res.json({ user: safe })
  })

  // ---- PROJECTS ----
  app.get('/api/projects', auth, (req, res) => {
    const projects = data.projects
      .filter(p => p.user_id === req.user.id)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map(({ user_id, ...rest }) => rest)
    res.json({ projects })
  })

  app.post('/api/projects', auth, (req, res) => {
    const { name, description } = req.body
    const id = uuidv4()
    const now = new Date().toISOString()
    const project = {
      id, name, description, user_id: req.user.id,
      settings: {
        framework: 'react', styling: 'inline', typescript: true,
        theme: { primaryColor: '#3b82f6', fontFamily: 'Inter, sans-serif', borderRadius: '8px' },
      },
      created_at: now, updated_at: now,
    }
    data.projects.push(project)

    const pageId = uuidv4()
    data.pages.push({
      id: pageId, project_id: id, title: 'Startseite', slug: 'home', status: 'published',
      meta: {}, created_at: now, updated_at: now,
    })
    saveData()

    const { user_id, ...safe } = project
    res.json({ project: { ...safe, pages: [pageId] } })
  })

  app.get('/api/projects/:id', auth, (req, res) => {
    const project = data.projects.find(p => p.id === req.params.id && p.user_id === req.user.id)
    if (!project) return res.status(404).json({ error: 'Not found' })
    const pages = data.pages.filter(p => p.project_id === req.params.id)
    const { user_id, ...safe } = project
    res.json({ ...safe, pages })
  })

  app.put('/api/projects/:id', auth, (req, res) => {
    const project = data.projects.find(p => p.id === req.params.id && p.user_id === req.user.id)
    if (!project) return res.status(404).json({ error: 'Not found' })
    if (req.body.name !== undefined) project.name = req.body.name
    if (req.body.description !== undefined) project.description = req.body.description
    if (req.body.settings !== undefined) project.settings = req.body.settings
    project.updated_at = new Date().toISOString()
    saveData()
    res.json({ success: true })
  })

  app.delete('/api/projects/:id', auth, (req, res) => {
    const idx = data.projects.findIndex(p => p.id === req.params.id && p.user_id === req.user.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    data.projects.splice(idx, 1)
    data.pages = data.pages.filter(p => p.project_id !== req.params.id)
    data.components = data.components.filter(c => c.pageId !== req.params.id)
    saveData()
    res.json({ success: true })
  })

  // ---- PAGES ----
  app.post('/api/pages', auth, (req, res) => {
    const { projectId, title, slug } = req.body
    const project = data.projects.find(p => p.id === projectId && p.user_id === req.user.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    const id = uuidv4()
    const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    data.pages.push({
      id, project_id: projectId, title, slug: pageSlug, status: 'draft', meta: {},
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    })
    saveData()
    res.json({ page: { id, projectId, title, slug: pageSlug, status: 'draft', meta: {} } })
  })

  app.put('/api/pages/:id', auth, (req, res) => {
    const page = data.pages.find(p => p.id === req.params.id)
    if (!page) return res.status(404).json({ error: 'Not found' })
    const project = data.projects.find(p => p.id === page.project_id && p.user_id === req.user.id)
    if (!project) return res.status(403).json({ error: 'Forbidden' })

    if (req.body.title) page.title = req.body.title
    if (req.body.slug) page.slug = req.body.slug
    if (req.body.status) page.status = req.body.status
    if (req.body.meta) page.meta = req.body.meta
    page.updated_at = new Date().toISOString()
    saveData()
    res.json({ success: true })
  })

  app.delete('/api/pages/:id', auth, (req, res) => {
    const page = data.pages.find(p => p.id === req.params.id)
    if (!page) return res.status(404).json({ error: 'Not found' })
    const project = data.projects.find(p => p.id === page.project_id && p.user_id === req.user.id)
    if (!project) return res.status(403).json({ error: 'Forbidden' })
    data.pages = data.pages.filter(p => p.id !== req.params.id)
    data.components = data.components.filter(c => c.pageId !== req.params.id)
    saveData()
    res.json({ success: true })
  })

  // ---- COMPONENTS ----
  app.post('/api/pages/:id/components', auth, (req, res) => {
    const pageId = req.params.id
    const page = data.pages.find(p => p.id === pageId)
    if (!page) return res.status(404).json({ error: 'Page not found' })
    const project = data.projects.find(p => p.id === page.project_id && p.user_id === req.user.id)
    if (!project) return res.status(403).json({ error: 'Forbidden' })

    const { nodes, rootIds } = req.body
    data.components = data.components.filter(c => c.pageId !== pageId)

    if (nodes) {
      Object.entries(nodes).forEach(([id, node]) => {
        data.components.push({
          id, pageId, type: node.type,
          props: JSON.stringify(node.props || {}),
          styles: JSON.stringify(node.styles || {}),
          parentId: node.parentId,
          sortOrder: 0,
        })
      })
    }
    saveData()
    res.json({ success: true })
  })

  app.get('/api/pages/:id/components', auth, (req, res) => {
    const pageId = req.params.id
    const rows = data.components.filter(c => c.pageId === pageId)

    const nodes = {}
    const rootIds = []

    rows.forEach(row => {
      nodes[row.id] = {
        id: row.id,
        type: row.type,
        props: JSON.parse(row.props || '{}'),
        styles: JSON.parse(row.styles || '{}'),
        parentId: row.parentId,
        children: [],
      }
    })

    rows.forEach(row => {
      if (row.parentId && nodes[row.parentId]) {
        nodes[row.parentId].children.push(row.id)
      } else {
        rootIds.push(row.id)
      }
    })

    res.json({ nodes, rootIds })
  })

  // ---- MEDIA ----
  app.get('/api/media', auth, (req, res) => {
    const media = data.media.filter(m => m.user_id === req.user.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    res.json({ media })
  })

  // ---- STATS ----
  app.get('/api/stats', auth, (req, res) => {
    const projects = data.projects.filter(p => p.user_id === req.user.id).length
    const pageIds = data.projects.filter(p => p.user_id === req.user.id).map(p => p.id)
    const pages = data.pages.filter(p => pageIds.includes(p.project_id)).length
    res.json({ projects, pages })
  })

  // ---- SERVE FRONTEND ----
  if (serveFrontend) {
    console.log('Serving frontend from:', staticDir)
    app.use(express.static(staticDir))

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
      res.sendFile(path.join(staticDir, 'index.html'), (err) => {
        if (err) res.status(404).send('Frontend not found.')
      })
    })
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║          UIForge - Visual UI Builder     ║
  ║──────────────────────────────────────────║
  ║  Server:  http://localhost:${PORT}        ║
  ║  Status:  ${serveFrontend ? 'Frontend + API' : 'API only (build frontend first)'}  ║
  ╚══════════════════════════════════════════╝
    `)
  })
}

main().catch(err => {
  console.error('Failed to start:', err.message)
  process.exit(1)
})

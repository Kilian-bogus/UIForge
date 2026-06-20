import { execSync } from 'child_process'
import { existsSync, cpSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const deployDir = join(__dirname, 'deploy')

console.log('[1/2] Baue Frontend...')
execSync('npm run build', { stdio: 'inherit', cwd: __dirname })

console.log('[2/2] Erstelle Server-Bundle...')
if (existsSync(deployDir)) rmSync(deployDir, { recursive: true })
mkdirSync(deployDir, { recursive: true })

cpSync(join(__dirname, 'index.js'), join(deployDir, 'index.js'))
cpSync(join(__dirname, 'package.json'), join(deployDir, 'package.json'))

const distSrc = join(__dirname, 'dist')
const distDst = join(deployDir, 'dist')
if (existsSync(distSrc)) cpSync(distSrc, distDst, { recursive: true })

function getSize(dir) {
  let total = 0
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    total += statSync(p).isDirectory() ? getSize(p) : statSync(p).size
  }
  return total
}
const totalMB = (getSize(deployDir) / 1024 / 1024).toFixed(1)

console.log('')
console.log('========================================')
console.log('  DEPLOY READY!')
console.log('========================================')
console.log('')
console.log(`  Groesse:  ${totalMB} MB`)
console.log('  Ordner:  deploy/')
console.log('')
console.log('  Auf dem Server:')
console.log('  1. deploy/ auf den Server kopieren')
console.log('  2. cd deploy')
console.log('  3. npm install')
console.log('  4. node index.js')
console.log('')
console.log('  Browser: http://DEINE-SERVER-IP:3004')
console.log('')

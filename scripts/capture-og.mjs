import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const url = process.argv[2] || 'https://norfeldt.github.io/galton-board/'
const outputPath = process.argv[3] || path.resolve(__dirname, '../public/og.png')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('#root', { state: 'attached', timeout: 15000 })
  await page.screenshot({ path: outputPath, fullPage: false })
  await browser.close()
  console.log(`Saved OG image to: ${outputPath}`)
})().catch((error) => {
  console.error(error)
  process.exit(1)
})


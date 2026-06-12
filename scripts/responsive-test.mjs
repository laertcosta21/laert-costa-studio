import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const sizes = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
]

const outDir = 'screenshots'
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()

for (const size of sizes) {
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  // Checa overflow horizontal
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth
  })

  await page.screenshot({ path: `${outDir}/${size.name}-top.png` })

  // Footer — scroll até o fim da página
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${outDir}/${size.name}-footer.png` })

  // Scroll pelas seções
  const sections = ['hero', 'servicos', 'diferenciais', 'projetos', 'sobre', 'contato']
  for (const id of sections) {
    const el = await page.$(`#${id}`)
    if (el) {
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      await page.screenshot({ path: `${outDir}/${size.name}-${id}.png` })
    }
  }

  console.log(`[${size.width}px] horizontal overflow: ${overflow}px`)
  await page.close()
}

await browser.close()

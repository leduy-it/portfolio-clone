import { test, expect } from 'playwright/test'

// Clear locale from localStorage before each test so we start fresh.
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.removeItem('leduy.locale'))
  await page.reload()
})

test.describe('Locale toggle (EN ↔ VI)', () => {
  test('default locale is English — brand reads michael.py_', async ({ page }) => {
    await page.goto('/')

    const brand = page.locator('header h1')
    await expect(brand).toBeVisible()
    const text = await brand.innerText()
    // After clearing localStorage, SSR default is EN.
    expect(text).toMatch(/michael\.py_/i)
  })

  test('clicking VI button swaps brand to leduy.py_ and nav to Vietnamese', async ({ page }) => {
    await page.goto('/')

    // Ensure we are in EN first
    const brand = page.locator('header h1')
    await expect(brand).toBeVisible()

    // Click the VI locale button (aria-label contains "Tiếng Việt")
    const viBtn = page.locator('button[aria-label="Tiếng Việt"]').first()
    await expect(viBtn).toBeVisible()
    await viBtn.click()

    // Brand should now read leduy.py_
    await expect(brand).toContainText('leduy')

    // Nav labels should switch to Vietnamese
    const nav = page.locator('header nav')
    const navText = await nav.innerText()
    expect(navText).toMatch(/Giới thiệu|Kinh nghiệm|Nghiên cứu|Điện ảnh/i)
  })

  test('VI locale persists after page reload', async ({ page }) => {
    await page.goto('/')

    // Switch to VI
    const viBtn = page.locator('button[aria-label="Tiếng Việt"]').first()
    await viBtn.click()

    // Confirm brand changed
    const brand = page.locator('header h1')
    await expect(brand).toContainText('leduy')

    // Reload — locale should be read from localStorage
    await page.reload()
    await expect(brand).toContainText('leduy')
  })

  test('clicking EN button swaps back and EN persists after reload', async ({ page }) => {
    await page.goto('/')

    // Switch to VI first
    const viBtn = page.locator('button[aria-label="Tiếng Việt"]').first()
    await viBtn.click()

    const brand = page.locator('header h1')
    await expect(brand).toContainText('leduy')

    // Switch back to EN
    const enBtn = page.locator('button[aria-label="English"]').first()
    await enBtn.click()

    await expect(brand).toContainText('michael')

    // Reload — should stay EN
    await page.reload()
    await expect(brand).toContainText('michael')
  })
})

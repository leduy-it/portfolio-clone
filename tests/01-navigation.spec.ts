import { test, expect } from 'playwright/test'

test.describe('Navigation', () => {
  test('home page renders header brand and nav links', async ({ page }) => {
    await page.goto('/')

    // Brand logo: either EN "michael.py_" or VI "leduy.py_"
    const brand = page.locator('header h1')
    await expect(brand).toBeVisible()
    const brandText = await brand.innerText()
    expect(brandText).toMatch(/leduy\.py_|michael\.py_/i)

    // Desktop nav links — the nav is inside header
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()

    // All four nav items must be present (EN or VI labels)
    const navText = await nav.innerText()
    expect(navText).toMatch(/About Me|Giới thiệu/i)
    expect(navText).toMatch(/Experience|Kinh nghiệm/i)
    expect(navText).toMatch(/Research|Nghiên cứu/i)
    expect(navText).toMatch(/Cinema|Điện ảnh/i)
  })

  test('clicking Experience nav link goes to /experience and shows heading', async ({ page }) => {
    await page.goto('/')

    // Click whichever locale variant is visible
    const expLink = page.locator('header nav a').filter({ hasText: /Experience|Kinh nghiệm/i }).first()
    await expLink.click()

    await expect(page).toHaveURL(/\/experience/)

    // Experience heading: "<ExperienceDex />" or Vietnamese variant
    const heading = page.locator('h1')
    await expect(heading.first()).toBeVisible()
    const headingText = await heading.first().innerText()
    expect(headingText).toMatch(/<ExperienceDex \/>|Collecting|experience/i)
  })

  test('clicking Research/Blog nav link goes to /blog and shows heading', async ({ page }) => {
    await page.goto('/')

    const blogLink = page.locator('header nav a').filter({ hasText: /Research|Nghiên cứu/i }).first()
    await blogLink.click()

    await expect(page).toHaveURL(/\/blog/)

    // Blog heading should be visible
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('clicking Cinema nav link goes to /photography and shows film cards', async ({ page }) => {
    await page.goto('/')

    const cinemaLink = page.locator('header nav a').filter({ hasText: /Cinema|Điện ảnh/i }).first()
    await cinemaLink.click()

    await expect(page).toHaveURL(/\/photography/)

    // Photography hero heading should be visible
    const heading = page.locator('h1')
    await expect(heading.first()).toBeVisible()

    // At least one film card link should be present
    const filmCards = page.locator('a[href^="/photography/"]')
    await expect(filmCards.first()).toBeVisible({ timeout: 10_000 })
  })
})

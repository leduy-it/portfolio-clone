import { test, expect } from 'playwright/test'

test.describe('Terminal chat flow', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state: no minimized/closed window state persisted
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('leduy-chat-state')
      localStorage.removeItem('leduy-chat-pos')
    })
    await page.reload()
  })

  test('chat container is visible on home page', async ({ page }) => {
    await page.goto('/')

    // The terminal chat title bar contains the shell prompt
    const titleBar = page.locator('text=/michael\\.py ~ %|leduy\\.py ~ %/').first()
    await expect(titleBar).toBeVisible({ timeout: 10_000 })
  })

  test('sends a message and receives an agent reply', async ({ page }) => {
    await page.goto('/')

    // Wait for the chat input to be ready
    const chatInput = page.locator('input[placeholder*="Ask"], input[placeholder*="Hỏi"]').first()
    await expect(chatInput).toBeVisible({ timeout: 10_000 })

    // Use a canned question that always produces an offline canned response
    // (avoids needing OPENROUTER_API_KEY for this assertion)
    await chatInput.fill("What's your AI stack?")
    await chatInput.press('Enter')

    // Wait up to 15s for a reply containing the agent prefix
    const replyLocator = page.locator('p').filter({
      hasText: /\[Duy's agent\]|\[trợ lí của Duy\]/i,
    })

    // The banner message already has the prefix — skip it and wait for a second one
    await expect(replyLocator.nth(1)).toBeVisible({ timeout: 15_000 })

    // The canned reply for "What's your AI stack?" mentions PyTorch / TensorRT etc.
    const replyText = await replyLocator.nth(1).innerText()
    expect(replyText).toMatch(/PyTorch|OCR|Triton|TensorRT|agent|Python/i)
  })

  test('green dot maximizes the chat window', async ({ page }) => {
    await page.goto('/')

    // Get bounding box before maximize
    const chatContainer = page.locator('[aria-label*="agent"], .rounded-3xl').first()
    await expect(chatContainer).toBeVisible({ timeout: 10_000 })

    const beforeBox = await chatContainer.boundingBox()

    // Click the green maximize button
    const greenBtn = page.locator('button[aria-label="Maximize window"]').first()
    await expect(greenBtn).toBeVisible()
    await greenBtn.click()

    // Either the dialog with aria-label appears, or the bounding box grows
    await page.waitForTimeout(300) // allow CSS transition

    // Check backdrop appeared (maximized state)
    const backdrop = page.locator('div[aria-hidden="true"]').filter({
      // backdrop has fixed position and covers the screen
    }).first()

    // OR check that the container is now in dialog role
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    // Restore by clicking the backdrop
    const backdropEl = page.locator('div[aria-hidden="true"]').first()
    await backdropEl.click()

    // Dialog should be gone
    await expect(dialog).not.toBeVisible({ timeout: 5_000 })

    // Bounding box should be back to approximately original size
    const afterBox = await chatContainer.boundingBox()
    if (beforeBox && afterBox) {
      // After restore, width should be smaller than maximized (960px max)
      expect(afterBox.width).toBeLessThan(900)
    }
  })

  test('"Send to Duy" button opens compose form panel', async ({ page }) => {
    await page.goto('/')

    // Click "Send to Duy" button (compose.button translation)
    const sendBtn = page.locator('button').filter({ hasText: /Send to Duy|Nhắn Duy/i }).first()
    await expect(sendBtn).toBeVisible({ timeout: 10_000 })
    await sendBtn.click()

    // Compose view should appear with subject, body and email inputs
    const subjectInput = page.locator('input[type="text"]').filter({ hasText: '' }).first()
    // Use label text instead
    const subjectLabel = page.locator('label').filter({ hasText: /Subject|Tiêu đề/i }).first()
    await expect(subjectLabel).toBeVisible({ timeout: 5_000 })

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()

    // Click Cancel — should return to chat view
    const cancelBtn = page.locator('button').filter({ hasText: /Cancel|Huỷ/i }).first()
    await expect(cancelBtn).toBeVisible()
    await cancelBtn.click()

    // Compose panel should be gone; chat input should be back
    const chatInput = page.locator('input[placeholder*="Ask"], input[placeholder*="Hỏi"]').first()
    await expect(chatInput).toBeVisible({ timeout: 5_000 })
  })
})

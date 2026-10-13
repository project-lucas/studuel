import { expect, test, type Page } from '@playwright/test'

// LE SMOKE TEST — cf. playwright.config.ts pour le pourquoi et les variables.

const EMAIL = process.env.E2E_EMAIL ?? ''
const MOT_DE_PASSE = process.env.E2E_PASSWORD ?? ''

/** Les deux écrans de pépin de l'app : les voir, c'est un échec. */
async function aucunPepin(page: Page): Promise<void> {
  const corps = page.locator('body')
  await expect(corps).not.toContainText('Oups, ça a cassé')
  await expect(corps).not.toContainText('Cette page n’existe pas')
}

/** Les pannes silencieuses : une réponse 5xx ou une exception non rattrapée. */
function surveiller(page: Page): { pannes: string[] } {
  const pannes: string[] = []
  page.on('response', (r) => {
    if (r.status() >= 500) pannes.push(`${r.status()} ${r.url()}`)
  })
  page.on('pageerror', (e) => pannes.push(`exception : ${e.message}`))
  return { pannes }
}

test.describe('les pages publiques', () => {
  test('l’accueil « Bienvenue » propose de commencer', async ({ page }) => {
    const { pannes } = surveiller(page)
    await page.goto('/bienvenue')
    await expect(page.getByRole('button', { name: /c.est parti/i })).toBeVisible()
    await aucunPepin(page)
    expect(pannes).toEqual([])
  })

  test('la connexion montre son formulaire', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await aucunPepin(page)
  })

  test('une adresse inconnue donne la page introuvable, en français', async ({ page }) => {
    await page.goto('/une-page-qui-nexiste-pas')
    await expect(page.getByRole('heading', { name: /n.existe pas/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /retour à l.accueil/i })).toBeVisible()
  })

  test('la coquille hors-ligne, le service worker et le manifeste sont servis', async ({ request }) => {
    const horsLigne = await request.get('/hors-ligne.html')
    expect(horsLigne.status()).toBe(200)
    expect(await horsLigne.text()).toContain('Tu es hors connexion')

    const sw = await request.get('/sw.js')
    expect(sw.status()).toBe(200)
    expect(sw.headers()['content-type']).toMatch(/javascript/)
    expect(await sw.text()).toContain('studuel-v1')

    const manifeste = await request.get('/manifest.webmanifest')
    expect(manifeste.status()).toBe(200)
    expect(await manifeste.json()).toMatchObject({ name: 'Studuel', start_url: '/lancement.html' })
  })

  test('la route des erreurs refuse un corps vide et accepte un rapport', async ({ request }) => {
    const vide = await request.post('/api/erreurs', { data: '' })
    expect(vide.status()).toBe(400)
    const rapport = await request.post('/api/erreurs', {
      data: { message: 'smoke test e2e', nom: 'SmokeTest', url: '/e2e', contexte: { ou: 'e2e' } },
    })
    expect(rapport.status()).toBe(204)
  })
})

test.describe('le parcours d’un élève connecté', () => {
  test.skip(!EMAIL || !MOT_DE_PASSE, 'E2E_EMAIL et E2E_PASSWORD absents : parcours connecté sauté')

  test('réviser une matière, lire un cours, ouvrir un quiz, puis les autres onglets', async ({ page }) => {
    const { pannes } = surveiller(page)

    await page.goto('/login')
    await page.fill('input[name="email"]', EMAIL)
    await page.fill('input[name="password"]', MOT_DE_PASSE)
    await page.locator('form button[type="submit"]').first().click()
    await page.waitForURL(/\/(defi|reviser|compte|onboarding)(\/|\?|$)/, { timeout: 60_000 })

    // Réviser : la grille des matières et la loupe globale.
    await page.goto('/reviser')
    await expect(page.getByRole('button', { name: /chercher une fiche/i })).toBeVisible()
    await aucunPepin(page)

    // La première matière : son dossier (bannière, portes, sommaire).
    const matiere = page.locator('a[href^="/reviser/"]').first()
    await expect(matiere).toBeVisible()
    await matiere.click()
    await expect(page).toHaveURL(/\/reviser\/[^/?]+(\?.*)?$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await aucunPepin(page)

    // Une fiche : son bouton « Cours » mène au cours.
    const cours = page.getByRole('link', { name: /^cours$/i }).first()
    await expect(cours).toBeVisible()
    await cours.click()
    await expect(page).toHaveURL(/\/reviser\/[^/]+\/[^/]+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await aucunPepin(page)

    // Le quiz de cette fiche s'ouvre (sans le jouer : il écrit en base).
    const quiz = page.getByRole('link', { name: /quiz/i }).first()
    if (await quiz.isVisible()) {
      await quiz.click()
      await page.waitForLoadState('domcontentloaded')
      await aucunPepin(page)
    }

    // Les autres onglets répondent.
    for (const onglet of ['/defi', '/amis', '/moi', '/tresor']) {
      await page.goto(onglet)
      await page.waitForLoadState('domcontentloaded')
      await aucunPepin(page)
    }

    expect(pannes).toEqual([])
  })
})

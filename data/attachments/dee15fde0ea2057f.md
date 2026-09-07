# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/dashboards.spec.ts >> Dashboards UI >> 01 · App de Clientes - Robot Sintético
- Location: tests/ui/dashboards.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('SOLICITUDES PROCESADAS CORRECTAMENTE')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('SOLICITUDES PROCESADAS CORRECTAMENTE')

```

```yaml
- link "Volver al índice":
  - /url: /
  - text: ÍNDICE
- main "Disponibilidad de la App de Clientes":
  - paragraph: TOTALPLAY · NOC
  - heading "App de Clientes" [level=1]
  - paragraph: CONSULTANDO DATADOG
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { DashboardPage } from '../../pages/DashboardPage';
  3   | 
  4   | test.describe('Dashboards UI', () => {
  5   |   test('should display 20 dashboards on the index', async ({ page }) => {
  6   |     const dashboardPage = new DashboardPage(page);
  7   |     await dashboardPage.goto();
  8   |     await dashboardPage.expectLoaded();
  9   |     expect(await dashboardPage.getDashboardCount()).toBe(20);
  10  |   });
  11  | 
  12  |   // Dashboard 01 — App de Clientes - Robot Sintético
  13  |   test('01 · App de Clientes - Robot Sintético', async ({ page }) => {
  14  |     const db = new DashboardPage(page);
  15  |     await db.navigateTo('/app-clientes');
  16  | 
  17  |     await expect(page).toHaveURL(/\/app-clientes/);
  18  |     await expect(page.locator('h1')).toHaveText('App de Clientes');
> 19  |     await expect(page.getByText('SOLICITUDES PROCESADAS CORRECTAMENTE')).toBeVisible({ timeout: 10000 });
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  20  |     await expect(page.getByText('SOLICITUDES NO COMPLETADAS POR DATOS INVÁLIDOS DEL CLIENTE')).toBeVisible();
  21  |     await expect(page.getByText('SOLICITUDES NO COMPLETADAS POR FALLA DEL SISTEMA')).toBeVisible();
  22  |     await expect(page.getByText('TIEMPO DE RESPUESTA PROMEDIO')).toBeVisible();
  23  |   });
  24  | 
  25  |   // Dashboard 05 — Login - Inicio
  26  |   test('05 · Login - Inicio', async ({ page }) => {
  27  |     const db = new DashboardPage(page);
  28  |     await db.navigateTo('/servicios/login-inicio');
  29  | 
  30  |     await expect(page).toHaveURL(/\/servicios\/login-inicio/);
  31  |     await expect(page.locator('h2').filter({ hasText: 'Login' })).toBeVisible({ timeout: 15000 });
  32  |     await expect(page.locator('h2').filter({ hasText: 'Home' })).toBeVisible();
  33  |     await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 15000 });
  34  |     await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  35  |   });
  36  | 
  37  |   // Dashboard 06 — TV - Pago
  38  |   test('06 · TV - Pago', async ({ page }) => {
  39  |     const db = new DashboardPage(page);
  40  |     await db.navigateTo('/servicios/tv-pagos');
  41  | 
  42  |     await expect(page).toHaveURL(/\/servicios\/tv-pagos/);
  43  |     await expect(page.locator('h2').filter({ hasText: 'TV' })).toBeVisible({ timeout: 15000 });
  44  |     await expect(page.locator('h2').filter({ hasText: 'Pagos' })).toBeVisible();
  45  |     await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 15000 });
  46  |     await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  47  |   });
  48  | 
  49  |   // Dashboard 07 — Club - Ayuda
  50  |   test('07 · Club - Ayuda', async ({ page }) => {
  51  |     const db = new DashboardPage(page);
  52  |     await db.navigateTo('/servicios/club-ayuda');
  53  | 
  54  |     await expect(page).toHaveURL(/\/servicios\/club-ayuda/);
  55  |     await expect(page.locator('h2').filter({ hasText: 'Club' })).toBeVisible({ timeout: 10000 });
  56  |     await expect(page.locator('h2').filter({ hasText: 'Ayuda' })).toBeVisible();
  57  |     await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 10000 });
  58  |     await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  59  |   });
  60  | 
  61  |   // Dashboard 08 — Marketplace - Delivery
  62  |   test('08 · Marketplace - Delivery', async ({ page }) => {
  63  |     const db = new DashboardPage(page);
  64  |     await db.navigateTo('/servicios/marketplace-delivery');
  65  | 
  66  |     await expect(page).toHaveURL(/\/servicios\/marketplace-delivery/);
  67  |     await expect(page.locator('h2').filter({ hasText: 'Marketplace' })).toBeVisible({ timeout: 10000 });
  68  |     await expect(page.locator('h2').filter({ hasText: 'Delivery' })).toBeVisible();
  69  |     await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 10000 });
  70  |     await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  71  |   });
  72  | 
  73  |   // Dashboard 09 — Topología de Servicios
  74  |   test('09 · Topología de Servicios', async ({ page }) => {
  75  |     const db = new DashboardPage(page);
  76  |     await db.navigateTo('/topologia');
  77  | 
  78  |     await expect(page).toHaveURL(/\/topologia/);
  79  |     await expect(page.getByText('TOPOLOGÍA · TV · CLIENTE → ENTREGA')).toBeVisible();
  80  |     await expect(page.getByText('CLIENTE', { exact: true })).toBeVisible();
  81  |     await expect(page.getByText('BORDE', { exact: true })).toBeVisible();
  82  |     await expect(page.getByText('ENTREGA', { exact: true })).toBeVisible();
  83  |     await expect(page.getByText('LA CADENA CONTINÚA EN LA PANTALLA 10 →')).toBeVisible();
  84  |   });
  85  | 
  86  |   // Dashboard 10 — Alertas e Incidencias
  87  |   test('10 · Alertas e Incidencias', async ({ page }) => {
  88  |     const db = new DashboardPage(page);
  89  |     await db.navigateTo('/monitores');
  90  | 
  91  |     await expect(page).toHaveURL(/\/monitores/);
  92  |     await expect(page.locator('h2').filter({ hasText: 'Monitores en alerta' })).toBeVisible({ timeout: 15000 });
  93  |     await expect(page.locator('h2').filter({ hasText: 'Monitores en advertencia' })).toBeVisible();
  94  |   });
  95  | 
  96  |   // Dashboard 12 — Análisis de Negocio
  97  |   test('12 · Análisis de Negocio', async ({ page }) => {
  98  |     const db = new DashboardPage(page);
  99  |     await db.navigateTo('/analisis-negocio');
  100 | 
  101 |     await expect(page).toHaveURL(/\/analisis-negocio/);
  102 |     await expect(page.locator('h1')).toHaveText('Análisis de negocio', { timeout: 15000 });
  103 |     await expect(page.locator('h2').filter({ hasText: 'Marketplace' })).toBeVisible();
  104 |     await expect(page.locator('h2').filter({ hasText: 'Delivery' })).toBeVisible();
  105 |     await expect(page.getByText('Hoy vs promedio 4 sem.').first()).toBeVisible();
  106 |   });
  107 | 
  108 |   // Dashboard 13 — Servicio IPTV - Cockpit
  109 |   test('13 · Servicio IPTV - Cockpit', async ({ page }) => {
  110 |     const db = new DashboardPage(page);
  111 |     await db.navigateTo('/iptv/cockpit');
  112 | 
  113 |     await expect(page).toHaveURL(/\/iptv\/cockpit/);
  114 |     await expect(page.locator('h1')).toHaveText('Servicio IPTV');
  115 |     await expect(page.getByText('ESTADO GENERAL')).toBeVisible();
  116 |     await expect(page.getByText('Solicitudes procesadas correctamente')).toBeVisible();
  117 |     await expect(page.getByText('Solicitudes no completadas por datos inválidos del cliente')).toBeVisible();
  118 |     await expect(page.getByText('Solicitudes no completadas por falla del sistema')).toBeVisible();
  119 |     await expect(page.getByText('Tiempo de respuesta')).toBeVisible();
```
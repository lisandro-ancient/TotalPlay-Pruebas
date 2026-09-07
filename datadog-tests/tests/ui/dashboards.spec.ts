import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboards UI', () => {
  test('should display 20 dashboards on the index', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
    expect(await dashboardPage.getDashboardCount()).toBe(20);
  });

  // Dashboard 01 — App de Clientes - Robot Sintético
  test('01 · App de Clientes - Robot Sintético', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/app-clientes');

    await expect(page).toHaveURL(/\/app-clientes/);
    await expect(page.locator('h1')).toHaveText('App de Clientes');
    await expect(page.getByText('SOLICITUDES PROCESADAS CORRECTAMENTE')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('SOLICITUDES NO COMPLETADAS POR DATOS INVÁLIDOS DEL CLIENTE')).toBeVisible();
    await expect(page.getByText('SOLICITUDES NO COMPLETADAS POR FALLA DEL SISTEMA')).toBeVisible();
    await expect(page.getByText('TIEMPO DE RESPUESTA PROMEDIO')).toBeVisible();
  });

  // Dashboard 05 — Login - Inicio
  test('05 · Login - Inicio', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/servicios/login-inicio');

    await expect(page).toHaveURL(/\/servicios\/login-inicio/);
    await expect(page.locator('h2').filter({ hasText: 'Login' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Home' })).toBeVisible();
    await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible();
    await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  });

  // Dashboard 06 — TV - Pago
  test('06 · TV - Pago', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/servicios/tv-pagos');

    await expect(page).toHaveURL(/\/servicios\/tv-pagos/);
    await expect(page.locator('h2').filter({ hasText: 'TV' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h2').filter({ hasText: 'Pagos' })).toBeVisible();
    await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  });

  // Dashboard 07 — Club - Ayuda
  test('07 · Club - Ayuda', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/servicios/club-ayuda');

    await expect(page).toHaveURL(/\/servicios\/club-ayuda/);
    await expect(page.locator('h2').filter({ hasText: 'Club' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2').filter({ hasText: 'Ayuda' })).toBeVisible();
    await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  });

  // Dashboard 08 — Marketplace - Delivery
  test('08 · Marketplace - Delivery', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/servicios/marketplace-delivery');

    await expect(page).toHaveURL(/\/servicios\/marketplace-delivery/);
    await expect(page.locator('h2').filter({ hasText: 'Marketplace' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2').filter({ hasText: 'Delivery' })).toBeVisible();
    await expect(page.getByText('Disponibilidad (%) · Últimas 4 horas').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tiempo de respuesta promedio · Últimas 4 horas').first()).toBeVisible();
  });

  // Dashboard 09 — Topología de Servicios
  test('09 · Topología de Servicios', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/topologia');

    await expect(page).toHaveURL(/\/topologia/);
    await expect(page.getByText('TOPOLOGÍA · TV · CLIENTE → ENTREGA')).toBeVisible();
    await expect(page.getByText('CLIENTE', { exact: true })).toBeVisible();
    await expect(page.getByText('BORDE', { exact: true })).toBeVisible();
    await expect(page.getByText('ENTREGA', { exact: true })).toBeVisible();
    await expect(page.getByText('LA CADENA CONTINÚA EN LA PANTALLA 10 →')).toBeVisible();
  });

  // Dashboard 10 — Alertas e Incidencias
  test('10 · Alertas e Incidencias', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/monitores');

    await expect(page).toHaveURL(/\/monitores/);
    await expect(page.locator('h2').filter({ hasText: 'Monitores en alerta' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h2').filter({ hasText: 'Monitores en advertencia' })).toBeVisible();
  });

  // Dashboard 12 — Análisis de Negocio
  test('12 · Análisis de Negocio', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/analisis-negocio');

    await expect(page).toHaveURL(/\/analisis-negocio/);
    await expect(page.locator('h1')).toHaveText('Análisis de negocio', { timeout: 15000 });
    await expect(page.locator('h2').filter({ hasText: 'Marketplace' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Delivery' })).toBeVisible();
    await expect(page.getByText('Hoy vs promedio 4 sem.').first()).toBeVisible();
  });

  // Dashboard 13 — Servicio IPTV - Cockpit
  test('13 · Servicio IPTV - Cockpit', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/iptv/cockpit');

    await expect(page).toHaveURL(/\/iptv\/cockpit/);
    await expect(page.locator('h1')).toHaveText('Servicio IPTV');
    await expect(page.getByText('ESTADO GENERAL')).toBeVisible();
    await expect(page.getByText('Solicitudes procesadas correctamente')).toBeVisible();
    await expect(page.getByText('Solicitudes no completadas por datos inválidos del cliente')).toBeVisible();
    await expect(page.getByText('Solicitudes no completadas por falla del sistema')).toBeVisible();
    await expect(page.getByText('Tiempo de respuesta')).toBeVisible();
  });

  // Dashboard 14 — Servicio IPTV - Servicios
  test('14 · Servicio IPTV - Servicios', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/iptv/servicios');

    await expect(page).toHaveURL(/\/iptv\/servicios/);
    await expect(page.locator('h1')).toHaveText('Los seis servicios de IPTV');
    await expect(page.locator('h2').filter({ hasText: 'Nueva Interfaz' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Guía de programación' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'APPS' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'On Demand' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Red WiFi' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Ajustes' })).toBeVisible();
  });

  // Dashboard 15 — Servicio IPTV - IA
  test('15 · Servicio IPTV - IA', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/iptv/ia');

    await expect(page).toHaveURL(/\/iptv\/ia/);
    await expect(page.getByText('ÍNDICE')).toBeVisible({ timeout: 15000 });
  });

  // Dashboard 16 — Aprovisionamiento - Cockpit
  test('16 · Aprovisionamiento - Cockpit', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/aprovisionamiento/cockpit');

    await expect(page).toHaveURL(/\/aprovisionamiento\/cockpit/);
    await expect(page.locator('h1')).toHaveText('Aprovisionamiento residencial');
    await expect(page.getByText('ESTADO GENERAL')).toBeVisible();
    await expect(page.getByText('Activaciones exitosas')).toBeVisible();
    await expect(page.getByText('Activaciones con error')).toBeVisible();
    await expect(page.getByText('Activaciones sin respuesta')).toBeVisible();
    await expect(page.getByText('Total de eventos en la red')).toBeVisible();
    await expect(page.getByText('Soportes manuales')).toBeVisible();
  });

  // Dashboard 17 — Aprovisionamiento - Origen
  test('17 · Aprovisionamiento - Origen', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/aprovisionamiento/origen');

    await expect(page).toHaveURL(/\/aprovisionamiento\/origen/);
    await expect(page.locator('h1')).toHaveText('Origen y alta de servicio');
    await expect(page.locator('h2').filter({ hasText: 'Origen App FFM / UX' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Alta BRM' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Carga Sistema' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Alta IMS' })).toBeVisible();
  });

  // Dashboard 18 — Aprovisionamiento - Activación
  test('18 · Aprovisionamiento - Activación', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/aprovisionamiento/activacion');

    await expect(page).toHaveURL(/\/aprovisionamiento\/activacion/);
    await expect(page.locator('h1')).toHaveText('Activación y asignación');
    await expect(page.locator('h2').filter({ hasText: 'Creación Usuario AAA' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Autofind' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Genera DN' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Gestor Asignado' })).toBeVisible();
  });

  // Dashboard 19 — Aprovisionamiento - Gestores
  test('19 · Aprovisionamiento - Gestores', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/aprovisionamiento/gestores');

    await expect(page).toHaveURL(/\/aprovisionamiento\/gestores/);
    await expect(page.locator('h1')).toHaveText('Efectividad según gestor');
  });

  // Dashboard 20 — Aprovisionamiento - IA
  test('20 · Aprovisionamiento - IA', async ({ page }) => {
    const db = new DashboardPage(page);
    await db.navigateTo('/aprovisionamiento/ia');

    await expect(page).toHaveURL(/\/aprovisionamiento\/ia/);
    await expect(page.getByText('ÍNDICE')).toBeVisible({ timeout: 15000 });
  });
});

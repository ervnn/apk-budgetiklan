/**
 * Jest Unit Test – Fitur Autentikasi (Login)
 * Sistem Pengelolaan Anggaran Iklan Digital
 */

const request = require('supertest');
const app = require('../server');

// ─────────────────────────────────────────────
// TC-01 s/d TC-05 – Autentikasi / Login
// ─────────────────────────────────────────────
describe('🔐 Fitur Login (Autentikasi)', () => {

  // TC-01: Email dan password kosong
  test('TC-01: Menolak login jika email dan password kosong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/harus diisi/i);
  });

  // TC-02: Email kosong, password ada
  test('TC-02: Menolak login jika email kosong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'somepassword' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TC-03: Password kosong, email ada
  test('TC-03: Menolak login jika password kosong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TC-04: Email valid tapi password salah
  test('TC-04: Mengembalikan 401 jika email/password salah', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'salah@email.com', password: 'passwordsalah123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // TC-05: Validasi input (email/password kosong) mengembalikan struktur JSON benar
  test('TC-05: Respons validasi input memiliki struktur JSON yang benar', async () => {
    // Gunakan input kosong untuk validasi lokal (tidak perlu panggil DB)
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });
});

// ─────────────────────────────────────────────
// TC-06 s/d TC-10 – Campaign (CRUD)
// ─────────────────────────────────────────────
describe('📋 Fitur Campaign (CRUD)', () => {

  // TC-06: Akses campaign tanpa token harus ditolak
  test('TC-06: Menolak GET /api/campaigns tanpa Authorization token', async () => {
    const res = await request(app)
      .get('/api/campaigns');

    // Harus 401 Unauthorized (tidak ada token)
    expect(res.status).toBe(401);
  });

  // TC-07: Akses campaign dengan token tidak valid
  test('TC-07: Menolak GET /api/campaigns dengan token tidak valid', async () => {
    const res = await request(app)
      .get('/api/campaigns')
      .set('Authorization', 'Bearer tokenpalsu12345');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // TC-08: POST campaign tanpa token harus ditolak
  test('TC-08: Menolak POST /api/campaigns tanpa token', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .send({
        nama_campaign: 'Test Campaign',
        platform: 'Instagram',
        total_budget: 5000000
      });

    expect(res.status).toBe(401);
  });

  // TC-09: DELETE campaign tanpa token harus ditolak
  test('TC-09: Menolak DELETE /api/campaigns/:id tanpa token', async () => {
    const res = await request(app)
      .delete('/api/campaigns/999');

    expect(res.status).toBe(401);
  });

  // TC-10: PUT campaign tanpa token harus ditolak
  test('TC-10: Menolak PUT /api/campaigns/:id tanpa token', async () => {
    const res = await request(app)
      .put('/api/campaigns/999')
      .send({ nama_campaign: 'Update Test' });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────
// TC-11 s/d TC-15 – Dashboard & Health Check
// ─────────────────────────────────────────────
describe('📊 Dashboard & Health Check', () => {

  // TC-11: Health check endpoint harus mengembalikan 200
  test('TC-11: GET /api/health mengembalikan status 200 dan success=true', async () => {
    const res = await request(app)
      .get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Budget Iklan');
  });

  // TC-12: Health check memiliki field timestamp
  test('TC-12: GET /api/health mengembalikan field timestamp', async () => {
    const res = await request(app)
      .get('/api/health');

    expect(res.body).toHaveProperty('timestamp');
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });

  // TC-13: Route tidak ada harus mengembalikan 404
  test('TC-13: Route tidak dikenal mengembalikan 404', async () => {
    const res = await request(app)
      .get('/api/tidak-ada-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // TC-14: Akses dashboard tanpa token harus ditolak
  test('TC-14: GET /api/dashboard/summary tanpa token mengembalikan 401', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary');

    expect(res.status).toBe(401);
  });

  // TC-15: 404 response memiliki format JSON yang benar
  test('TC-15: Respons 404 memiliki struktur JSON yang benar', async () => {
    const res = await request(app)
      .get('/api/endpoint-tidak-ada');

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });
});

/**
 * Integration test script for rs-whitelabel-api
 * Run: node scripts/test-api.mjs
 * Requires the API server running at http://localhost:3000
 */

const BASE = 'http://localhost:3000/api'
const TENANT = 'acme'

let passed = 0
let failed = 0

async function request(method, path, body) {
  const url = `${BASE}/${TENANT}${path}`
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }
  const res = await fetch(url, opts)
  const json = await res.json().catch(() => ({}))
  return { status: res.status, ok: res.ok, json }
}

async function test(label, fn) {
  try {
    await fn()
    console.log(`  ✓ ${label}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

// ── Resource test suites ───────────────────────────────────────────────────

async function testResource(name, path, createPayload, updatePayload) {
  console.log(`\n▸ ${name}`)
  let createdId

  await test(`GET ${path} returns list`, async () => {
    const r = await request('GET', `${path}?page=1&limit=5`)
    assert(r.ok, `HTTP ${r.status}`)
    assert(r.json.success === true, 'success !== true')
    assert(Array.isArray(r.json.data), 'data is not an array')
    assert(r.json.meta?.total != null, 'meta.total missing')
  })

  if (createPayload) {
    await test(`POST ${path} creates record`, async () => {
      const r = await request('POST', path, createPayload)
      assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
      assert(r.json.success === true, 'success !== true')
      assert(r.json.data?.id, 'created id missing')
      createdId = r.json.data.id
    })

    if (createdId) {
      await test(`GET ${path}/:id returns created record`, async () => {
        const r = await request('GET', `${path}/${createdId}`)
        assert(r.ok, `HTTP ${r.status}`)
        assert(r.json.data?.id === createdId, 'id mismatch')
      })

      if (updatePayload) {
        await test(`PUT/PATCH ${path}/:id updates record`, async () => {
          // try PUT first, fall back to PATCH
          let r = await request('PUT', `${path}/${createdId}`, updatePayload)
          if (!r.ok) r = await request('PATCH', `${path}/${createdId}`, updatePayload)
          assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
        })
      }

      await test(`DELETE ${path}/:id removes record`, async () => {
        const r = await request('DELETE', `${path}/${createdId}`)
        assert(r.ok, `HTTP ${r.status}`)
      })
    }
  }

  return createdId
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== RS Whitelabel API Integration Tests ===')
  console.log(`Base URL: ${BASE}/${TENANT}\n`)

  // Check connectivity first
  const health = await fetch(`${BASE}/health/live`).catch(() => null)
  if (!health?.ok) {
    console.error('ERROR: API server not reachable at', `${BASE}/health/live`)
    console.error('Start the API with: cd rs-whitelabel-api && npm run dev')
    process.exit(1)
  }
  console.log('✓ API server is reachable\n')

  // ── contacts
  const contactPayload = { firstName: 'Test', lastName: 'User', email: 'test.user@example.com', type: 'LEAD', intentScore: 75 }
  await testResource('Contacts', '/contacts', contactPayload, { intentScore: 90 })

  // ── pipeline stages (needed before deals)
  let stageId
  console.log('\n▸ Pipeline Stages')
  await test('GET /pipeline-stages returns list', async () => {
    const r = await request('GET', '/pipeline-stages?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
    stageId = r.json.data[0]?.id
  })
  await test('POST /pipeline-stages creates record', async () => {
    const r = await request('POST', '/pipeline-stages', { label: 'Test Stage', orderIndex: 99 })
    assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
    stageId = r.json.data?.id ?? stageId
    assert(stageId, 'stageId missing')
  })

  // ── tasks (requires assignedUserId — fetch an existing user)
  console.log('\n▸ Tasks')
  await test('GET /tasks returns list', async () => {
    const r = await request('GET', '/tasks?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })
  const usersForTask = await request('GET', '/users?page=1&limit=1')
  const userId = usersForTask.json.data?.[0]?.id
  if (userId) {
    await test('POST /tasks creates record', async () => {
      const r = await request('POST', '/tasks', { title: 'Test Task', status: 'PENDING', assignedUserId: userId })
      assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
      assert(r.json.data?.id, 'id missing')
    })
  } else {
    console.log('  - skipped POST /tasks (no users in DB)')
  }

  // ── campaigns
  await testResource('Campaigns', '/campaigns', { name: 'Test Campaign', type: 'DRIP_EMAIL', status: 'DRAFT', budget: 1000 }, { status: 'ACTIVE' })

  // ── portfolios
  await testResource('Portfolios', '/portfolios', { name: 'Test Portfolio', description: 'Integration test portfolio' }, { description: 'Updated description' })

  // ── properties
  await testResource('Properties', '/properties', { title: 'Test Property', propertyType: 'RESIDENTIAL', valuation: 250000 }, { valuation: 260000 })

  // ── projects
  let projectId
  console.log('\n▸ Projects')
  await test('GET /projects returns list', async () => {
    const r = await request('GET', '/projects?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
    projectId = r.json.data?.[0]?.id
  })
  await test('POST /projects creates record', async () => {
    const r = await request('POST', '/projects', { name: 'Test Project', status: 'PRE_CONSTRUCTION' })
    assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
    projectId = r.json.data?.id
    assert(projectId, 'projectId missing')
  })

  // ── units (requires projectId)
  console.log('\n▸ Units')
  await test('GET /units returns list', async () => {
    const r = await request('GET', '/units?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })
  if (projectId) {
    await test('POST /units creates record', async () => {
      const r = await request('POST', '/units', { projectId, unitNumber: 'T-001', price: 200000, status: 'AVAILABLE' })
      assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
      assert(r.json.data?.id, 'id missing')
    })
  } else {
    console.log('  - skipped POST /units (no project in DB)')
  }

  // ── deals (requires propertyId, contactId, assignedUserId, stageId)
  console.log('\n▸ Deals')
  await test('GET /deals returns list', async () => {
    const r = await request('GET', '/deals?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })
  if (stageId && userId) {
    const props = await request('GET', '/properties?page=1&limit=1')
    const propId = props.json.data?.[0]?.id
    const contacts = await request('GET', '/contacts?page=1&limit=1')
    const cId = contacts.json.data?.[0]?.id
    if (propId && cId) {
      await test('POST /deals creates record', async () => {
        const r = await request('POST', '/deals', { propertyId: propId, contactId: cId, assignedUserId: userId, stageId })
        assert(r.ok, `HTTP ${r.status} — ${JSON.stringify(r.json)}`)
        assert(r.json.data?.id, 'id missing')
      })
    } else {
      console.log('  - skipped POST /deals (missing property or contact in DB)')
    }
  } else {
    console.log('  - skipped POST /deals (missing stage or user in DB)')
  }

  // ── documents (requires dealId — skip create if no deals exist)
  console.log('\n▸ Documents')
  await test('GET /documents returns list', async () => {
    const r = await request('GET', '/documents?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(r.json.success === true, 'success !== true')
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── viewings
  console.log('\n▸ Viewings')
  await test('GET /viewings returns list', async () => {
    const r = await request('GET', '/viewings?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── maintenance-requests
  console.log('\n▸ Maintenance Requests')
  await test('GET /maintenance-requests returns list', async () => {
    const r = await request('GET', '/maintenance-requests?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── leases
  console.log('\n▸ Leases')
  await test('GET /leases returns list', async () => {
    const r = await request('GET', '/leases?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── users
  console.log('\n▸ Users')
  await test('GET /users returns list', async () => {
    const r = await request('GET', '/users?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── access-control-policies
  console.log('\n▸ Access Control Policies')
  await test('GET /access-control-policies returns list', async () => {
    const r = await request('GET', '/access-control-policies?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── spatial-tour-nodes
  console.log('\n▸ Spatial Tour Nodes')
  await test('GET /spatial-tour-nodes returns list', async () => {
    const r = await request('GET', '/spatial-tour-nodes?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── tags
  console.log('\n▸ Tags')
  await test('GET /tags returns list', async () => {
    const r = await request('GET', '/tags?page=1&limit=5')
    assert(r.ok, `HTTP ${r.status}`)
    assert(Array.isArray(r.json.data), 'data is not an array')
  })

  // ── Summary
  console.log('\n' + '='.repeat(40))
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })

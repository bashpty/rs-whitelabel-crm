const BASE_URL = 'http://localhost:3000/api'

// Tenant slug — injected via env or defaulting to 'acme'
export const TENANT = import.meta.env.VITE_TENANT_SLUG || 'acme'

class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, json.statusMessage || `HTTP ${res.status}`)
  }
  return json
}

// ── Generic CRUD factory ─────────────────────────────────────────────────────

export function crudEndpoints(resource) {
  const base = `/${TENANT}/${resource}`
  return {
    list: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
      ).toString()
      return request(`${base}${qs ? `?${qs}` : ''}`)
    },
    get:    (id)       => request(`${base}/${id}`),
    create: (body)     => request(base, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    patch:  (id, body) => request(`${base}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id)       => request(`${base}/${id}`, { method: 'DELETE' }),
  }
}

// ── Resource clients ─────────────────────────────────────────────────────────

export const contactsApi          = crudEndpoints('contacts')
export const interactionsApi      = crudEndpoints('interactions')
export const tasksApi             = crudEndpoints('tasks')
export const campaignsApi         = crudEndpoints('campaigns')
export const campaignMembersApi   = crudEndpoints('campaign-members')
export const portfoliosApi        = crudEndpoints('portfolios')
export const propertiesApi        = crudEndpoints('properties')
export const spatialNodesApi      = crudEndpoints('spatial-tour-nodes')
export const pipelineStagesApi    = crudEndpoints('pipeline-stages')
export const dealsApi             = crudEndpoints('deals')
export const documentsApi         = crudEndpoints('documents')
export const viewingsApi          = crudEndpoints('viewings')
export const offersApi            = crudEndpoints('offers')
export const contractsApi         = crudEndpoints('contracts')
export const leasesApi            = crudEndpoints('leases')
export const projectsApi          = crudEndpoints('projects')
export const unitsApi             = crudEndpoints('units')
export const maintenanceApi       = crudEndpoints('maintenance-requests')
export const tagsApi              = crudEndpoints('tags')
export const customFieldsApi      = crudEndpoints('custom-fields')
export const acpApi               = crudEndpoints('access-control-policies')
export const usersApi             = crudEndpoints('users')
export const integrationHealthApi = crudEndpoints('integration-health')

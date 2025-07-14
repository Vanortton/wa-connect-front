const BASE_URL = import.meta.env.PROD
    ? 'https://backend-779792751824.us-central1.run.app'
    : 'http://localhost:3000'
const STORE_URL = 'https://stores.vazap.com.br'

export { BASE_URL, STORE_URL }

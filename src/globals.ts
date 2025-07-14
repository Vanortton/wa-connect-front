const BASE_URL = import.meta.env.PROD
    ? 'https://www.vazap.com.br'
    : 'http://localhost:3000'
const STORE_URL = 'https://stores.vazap.com.br'

export { BASE_URL, STORE_URL }

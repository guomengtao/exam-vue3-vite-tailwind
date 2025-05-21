// src/api/admin/system.js
import http from '@/http'

export async function fetchStatus() {
  console.log('Calling fetchStatus()')
  const response = await http('/api/status')
  const res = await response.json()
  console.log('Parsed response:', res)
  return res
}
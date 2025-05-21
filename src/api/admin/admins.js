// src/api/admin.js
import http from '@/http'

export async function fetchAdmins() {
  console.log('Calling fetchAdmins()')  // ✅ Add this
  const response = await http('/api/admins')
  const res = await response.json()
  console.log('Parsed response:', res)
  return res
}
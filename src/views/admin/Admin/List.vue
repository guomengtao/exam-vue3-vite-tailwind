<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Admin List</h2>
    <div class="mb-4">
      <button @click="createAdmin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Admin
      </button>
    </div>
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">ID</th>
          <th class="border border-gray-300 px-4 py-2">Username</th>
          <th class="border border-gray-300 px-4 py-2">Role ID</th>
          <th class="border border-gray-300 px-4 py-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4" class="text-center py-4">Loading...</td>
        </tr>
        <tr v-else-if="admins.length === 0">
          <td colspan="4" class="text-center py-4">No data found.</td>
        </tr>
        <tr v-else v-for="admin in admins" :key="admin.id">
          <td class="border border-gray-300 px-4 py-2">{{ admin.id }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ admin.username }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ admin.role_id }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ admin.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchAdmins } from '@/api/admin/admins'

const admins = ref([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetchAdmins()
    console.log('API Response:', res)
    if (res.code === 200 && Array.isArray(res.data)) {
      admins.value = res.data
    } else {
      console.warn('Unexpected data format:', res)
    }
  } finally {
    loading.value = false
  }
})

function createAdmin() {
  // Future implementation for creating an admin
  console.log('Create Admin button clicked')
}
</script>
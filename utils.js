function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple catbox upload helper (no external dependency)
async function uploadToCatbox(buffer) {
  const FormData = require('./formdata-shim')
  const axios = require('axios')
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', { data: buffer, name: 'file.jpg', filename: 'file.jpg' })
  const { data } = await axios.post('https://catbox.moe/user/api.php', form.getBuffer(), { headers: form.getHeaders() })
  return data.trim()
}

module.exports = { sleep, uploadToCatbox }

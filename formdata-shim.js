// Minimal multipart/form-data builder (no external dependency)
const { randomBytes } = require('crypto')

class FormData {
  constructor() {
    this.boundary = `----ManusFormBoundary${randomBytes(12).toString('hex')}`
    this.parts = []
  }
  append(key, value) {
    if (typeof value === 'string') {
      this.parts.push({ key, type: 'field', value })
    } else {
      this.parts.push({ key, type: 'file', ...value })
    }
  }
  getBuffer() {
    const chunks = []
    for (const part of this.parts) {
      chunks.push(Buffer.from(`--${this.boundary}\r\n`))
      if (part.type === 'field') {
        chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.key}"\r\n\r\n${part.value}\r\n`))
      } else {
        chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.key}"; filename="${part.filename}"\r\nContent-Type: application/octet-stream\r\n\r\n`))
        chunks.push(Buffer.isBuffer(part.data) ? part.data : Buffer.from(part.data))
        chunks.push(Buffer.from('\r\n'))
      }
    }
    chunks.push(Buffer.from(`--${this.boundary}--\r\n`))
    return Buffer.concat(chunks)
  }
  getHeaders() {
    return { 'Content-Type': `multipart/form-data; boundary=${this.boundary}` }
  }
}

module.exports = FormData

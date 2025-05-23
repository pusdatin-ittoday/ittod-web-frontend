import instance from './axios.js'

export const submitFileCompe = (data) => {
    return instance.post('/api/file', data)
}

export const updateFileCompe = (data) => {
    return instance.put('/api/file', data)
}
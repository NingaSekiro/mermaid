// axios基础的封装
import axios from 'axios'

const httpInstance = axios.create({
  baseURL: '/api/aopPlugin',
  timeout: 5000
})

export default httpInstance
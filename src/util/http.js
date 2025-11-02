// axios基础的封装
import axios from 'axios'

const httpInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://127.0.0.1:4523/m1/3567791-3196277-default'
    : '/api/aopPlugin',
  timeout: 5000
})

// const httpInstance= axios.create({
//   baseURL: 'http://127.0.0.1:4523/m1/3567791-3196277-default',
//   timeout: 5000
// })

export default httpInstance
import axios from 'axios'
import R from 'ramda'
import {
    ADD_TODO_SERVICE,
    GET_TODOS_SERVICE,
    DELTE_TODO_SERVICE
} from '../constants/api'

const defaults = {
    withCredentials: false,
    timeout: 100000
}

const BASE_URL = process.env.API_URL

const servicesDesc = [
    {
        name: ADD_TODO_SERVICE, url: `${BASE_URL}/todos`, method: 'POST'
    },
    {
        name: GET_TODOS_SERVICE, url: `${BASE_URL}/todos`, method: 'GET'
    },
    {
        name: DELTE_TODO_SERVICE, url: `${BASE_URL}/todos`, method: 'DELETE'
    }
].map(service => R.merge(service, defaults))

const services = servicesDesc.reduce((acc, service) => {
    acc[service.name] = data => {
        service.data = data

        return axios(service)
    }

    return acc
}, {})

export const addTodoService = services[ADD_TODO_SERVICE]
export const getTodosService = services[GET_TODOS_SERVICE]
export const deleteTodoService = services[DELTE_TODO_SERVICE]

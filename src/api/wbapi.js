import {$host} from './index'

export const getItems = async (skip, take) => {
    const {data} = await $host.get('/api/item/get', {params: {skip, take}})
    return data
}

export const getOrders = async (date_start, date_end, skip, take) => {
    const {data} = await $host.get('/api/order/get', {params: {date_start, date_end, skip, take}})
    return data
}
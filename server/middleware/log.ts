export default defineEventHandler(async(event) => {
    const url = getRequestURL(event)
    const query = getQuery(event)

    console.log('Request made to: ', url)
    console.log('Query params: ', query)
})
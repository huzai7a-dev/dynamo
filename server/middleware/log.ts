export default defineEventHandler(async(event) => {
    const url = getRequestURL(event)

    console.log('Request made to: ', url)

})
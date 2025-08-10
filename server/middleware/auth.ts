export default defineEventHandler(async(event) => {
    const session = await getUserSession(event)
    event.context.user = session.user
})
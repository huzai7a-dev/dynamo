export default defineEventHandler(async (event)=> {

    try {
        const formData = await readMultipartFormData(event);
        console.log(formData);
        
    } catch (error) {
        createError({
            statusCode: 400,
            data: JSON.stringify(error),
        })
    }

   }
)
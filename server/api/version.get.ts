
export default defineCachedEventHandler(
  async (event) => {
    const db = useDb()
    const result = await db`SELECT version()`;
    return result;
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  }
);
export const formateDate = (date: string)=> {
    const formatted = new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
        // hour12: true,
      });

      return formatted
}
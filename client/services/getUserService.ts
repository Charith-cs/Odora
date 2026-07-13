export const getUserFromStorage = () => {
    try {
        const rawUser = localStorage.getItem("user");

        if (!rawUser || rawUser === "undefined") return null;

        return JSON.parse(rawUser);
    } catch (err) {
        return null;
    }
};
const USER_ID_KEY = 'ai_tattoo_user_id';

export const getUserId = (): string => {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
};

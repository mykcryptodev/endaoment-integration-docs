export const ACCESS_TOKEN_NAME = 'ndao_token';
export const getAccessToken = (req) => {
    const tokenCookie = req.cookies[ACCESS_TOKEN_NAME];
    if (!tokenCookie)
        throw new Error('No access token found in cookies');
    return tokenCookie.access_token;
};

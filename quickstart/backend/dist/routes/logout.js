import { ACCESS_TOKEN_NAME } from "../utils/access-token.js";
export const logout = async (req, res) => {
    res.clearCookie(ACCESS_TOKEN_NAME);
    res.status(200);
    res.end();
};

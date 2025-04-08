import { getAccessToken } from '../utils/access-token.js';
export const checkLogin = async (req, res) => {
    try {
        const token = getAccessToken(req);
        res.json({ isSignedIn: true });
        res.end();
        return;
    }
    catch {
        res.json({ isSignedIn: false });
        res.end();
    }
};

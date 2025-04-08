import { getAccessToken } from '../utils/access-token.js';
import { getEndaomentUrls } from '../utils/endaoment-urls.js';
export async function getDafs(req, res) {
    const token = getAccessToken(req);
    try {
        const usersDafListResponse = await fetch(`${getEndaomentUrls().api}/v1/funds/mine`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Pass the user's token in the Authorization header
                Authorization: `Bearer ${token}`,
            },
        });
        const usersDafList = await usersDafListResponse.json();
        res.status(200);
        res.json(usersDafList);
        res.end();
    }
    catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error: 'An error occurred while fetching DAFs' });
        res.end();
    }
}

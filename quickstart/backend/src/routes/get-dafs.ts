import type { Request, Response } from 'express';
import { getAccessToken } from '../utils/access-token';

export async function getDafs(req: Request, res: Response) {
  const token = getAccessToken(req);

  const usersDafList = await fetch('https://api.endaoment.com/v1/funds/mine', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Pass the user's token in the Authorization header
      Authorization: `Bearer ${token}`,
    },
  });

  res.status(200);
  res.send(usersDafList);
  res.end();
}

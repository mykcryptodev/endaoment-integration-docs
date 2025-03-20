import crypto from 'crypto';
import { getAccessToken } from '../utils/access-token';
import type { Request, Response } from 'express';

export async function getWireInstructions(req: Request, res: Response) {
  const wireInstructions = await fetch(
    // For domestic wire instructions
    'https://api.endaoment.com/v1/donation-pledges/wire-pledge/details/domestic',
    // For international wire instructions
    // 'https://api.endaoment.com/v1/donation-pledges/wire-pledge/details/international',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        //   This does not need any authentication since this is public information
      },
    }
  );

  res.status(200);
  res.send(wireInstructions);
  res.end();
}

export async function wireDonation(req: Request, res: Response) {
  const amount = req.body['amount'];
  const receivingFundId = req.body['fundId'];

  if (!amount || !receivingFundId) {
    res.status(400);
    res.end();
    return;
  }

  const token = getAccessToken(req);

  const idempotencyKey = crypto.randomUUID();
  const pledgedAmountMicroDollars = (BigInt(amount) * 1000000n).toString();

  const donationRequest = await fetch(
    'https://api.endaoment.com/v1/donation-pledges/wire-pledge',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pledgedAmountMicroDollars,
        receivingFundId,
        idempotencyKey,
      }),
    }
  );

  res.status(200);
  res.send(donationRequest);
  res.end();
}

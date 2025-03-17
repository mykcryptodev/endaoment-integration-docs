type OrgAddress = {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
};

export type OrgListing = {
  id: string | null;
  ein: string | null;
  name: string;
  description: string | null;
  address: OrgAddress;
  website: string | null;
  logo: string;
  nteeCode: string;
  nteeDescription: string;
  isCompliant: boolean;
  lifetimeContributionsUsdc: string;
  donationsReceived: number;
  grantsReceived: number;
};

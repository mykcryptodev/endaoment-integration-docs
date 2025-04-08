export const getEndaomentUrls = (orgId: string | null) => {
  if (!orgId) {
    return {
      orgPage: '#',
    };
  }

  return {
    orgPage: `https://endaoment.org/org/${orgId}`,
  };
}; 
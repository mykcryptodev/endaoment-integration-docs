import { getEnvOrThrow } from "./env";

export const getEndaomentUrls = () => {
  const env = getEnvOrThrow("ENDAOMENT_ENVIRONMENT");

  if (env === "production") {
    return {
      auth: "https://auth.endaoment.org",
      api: "https://api.endaoment.org",
    };
  }

  return {
    auth: "https://auth.staging.endaoment.org",
    api: "https://api.staging.endaoment.org",
  };
};

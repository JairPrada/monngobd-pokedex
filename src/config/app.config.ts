export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || "dev",
  mongoStringConnection: process.env.MONGO_STRING_CONNECTION,
  port: process.env.PORT || 3001,
});

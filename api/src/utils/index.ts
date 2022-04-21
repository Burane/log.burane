export function getRefreshTokenExpiration() {
  const jwtRefreshSecretExpiration = parseInt(
    process.env.JWT_REFRESH_SECRET_EXPIRATION,
  );
  return new Date(
    Date.now() + 1000 * 60 * 60 * 24 * jwtRefreshSecretExpiration,
  );
}

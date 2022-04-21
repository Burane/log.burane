// Use this import if you want to use "env.js" file
// Or just specify it directly like this:

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: process.env.API_URL ?? 'http://localhost:3003',
  timeout: 10000,
}
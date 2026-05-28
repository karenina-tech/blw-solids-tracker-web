export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  ALLOWED_ORIGIN: string;
  TURNSTILE_SECRET?: string;
}

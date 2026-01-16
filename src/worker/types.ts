export type Bindings = {
  CORS_ORIGIN?: string;
  APP_ENV?: string;
  API_KEY?: string;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_SECONDS?: string;
  MAX_BODY_BYTES?: string;
};

export type Variables = {
  requestId?: string;
};

export type HonoEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_NAME: string;
    CACHE_URL: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    PORT: string;
    DBURL: string;
  }
}

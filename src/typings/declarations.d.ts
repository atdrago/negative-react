declare const MAIN_WINDOW_WEBPACK_ENTRY: string | undefined;

declare module '@electron/remote/main' {
  import { initialize } from '@electron/remote';
  export { initialize };
}

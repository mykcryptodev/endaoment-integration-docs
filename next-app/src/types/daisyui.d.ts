declare module 'daisyui' {
  import { PluginCreator } from 'tailwindcss/types/config';

  interface DaisyUIConfig {
    themes?: string[];
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    logs?: boolean;
    rtl?: boolean;
  }

  const plugin: { handler: PluginCreator; config?: DaisyUIConfig };
  export default plugin;
} 
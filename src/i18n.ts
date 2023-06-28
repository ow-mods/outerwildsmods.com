// For docs see https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md
import { getLocaleFromNavigator, init, addMessages as registerLocale } from 'svelte-i18n';

import en from '../locales/en.json';

registerLocale('en', en);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});

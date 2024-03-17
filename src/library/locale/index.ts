import { createInstance } from 'i18next'; 
import { LocaleInstance } from '../../core/locale';

export function createLocale(): LocaleInstance {
  const locale = createInstance();
  return {
    register: (resource) => {
      for (const ns in resource) {
        const namespace = resource[ns];
        if (!namespace) {
          continue;
        }
        for (const lang in namespace) {
          const src = namespace[lang];
          if (!src) {
            continue;
          }
          locale.addResourceBundle(lang, ns, src);
        }
      }
    }
  }
}

export const locale = createLocale();
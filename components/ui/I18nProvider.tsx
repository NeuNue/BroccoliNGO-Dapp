import React, { useEffect } from "react";
import localeEn from "@/dictionaries/en.json";
import localeZh from "@/dictionaries/zh.json";

const i18nContext = React.createContext<Record<string, string>>({});

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {

  const localeMap: Record<string, any> = {
    'en': localeEn,
    'zh': localeZh,
  }
  const [messages, setMessages] = React.useState(localeMap[locale] || localeEn);

  return (
    <i18nContext.Provider value={messages}>
      {children}
    </i18nContext.Provider>
  );
}

export function useI18n() {
  const context = React.useContext(i18nContext);
  
  return {
    getString(key: string, replace: Record<string, any> = {}) {
      const str = context[key] || key;
      const parts = Object.keys(replace).reduce((acc: (string | React.ReactNode)[], replaceKey) => {
        const newParts: (string | React.ReactNode)[] = [];
        acc.forEach(part => {
          if (typeof part === 'string') {
            const regex = new RegExp(`{{${replaceKey}}}`, 'g');
            const splitParts = part.split(regex);
            splitParts.forEach((splitPart, index) => {
              newParts.push(splitPart);
              if (index < splitParts.length - 1) {
                newParts.push(replace[replaceKey]);
              }
            });
          } else {
            newParts.push(part);
          }
        });
        return newParts;
      }, [str]);

      return parts.length > 1 ? <>{...parts}</> : parts[0];
    }
  }
}

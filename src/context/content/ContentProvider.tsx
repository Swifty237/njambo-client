import React, { useState, useEffect, useContext, PropsWithChildren } from 'react';
import ContentContext from './contentContext';
import useContentful from '../../hooks/useContentful';
import locaContext from '../localization/locaContext';

interface StaticPage {
  slug: string;
  title: string;
  content: string;
}

const ContentProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {

  const { lang }: any = useContext(locaContext); // => A typer proprement plus tard

  const contentfulClient = useContentful();

  const [isLoading, setIsLoading] = useState(true);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [localizedStrings, setLocalizedStrings] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoading(true);

    fetchContent();

    setIsLoading(false);
    // eslint-disable-next-line
  }, [lang]);

  const fetchContent = () => {
    contentfulClient
      .getEntries({ content_type: 'key', locale: lang })
      .then((res) => {
        let localizedStrings: Record<string, string> = {};

        res.items.forEach(
          (item: any) =>
          (localizedStrings[item.fields.keyName] =
            item.fields.value.fields.value),
        );

        setLocalizedStrings(localizedStrings);
      });

    contentfulClient
      .getEntries({ content_type: 'staticPage', locale: lang })
      .then((res) => {
        setStaticPages(
          res.items.map((item: any) => ({
            slug: item.fields.slug,
            title: item.fields.title,
            content: item.fields.content.fields.value,
          })),
        );
      });
  };

  const getLocalizedString = (key: string) =>
    localizedStrings && localizedStrings[key] ? localizedStrings[key] : key;

  return (
    <ContentContext.Provider
      value={{ isLoading, staticPages, getLocalizedString }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;

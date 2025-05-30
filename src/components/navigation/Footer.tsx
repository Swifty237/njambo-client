import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Text from '../typography/Text';
import ColoredText from '../typography/ColoredText';
import contentContext from '../../context/content/contentContext';

interface StyledFooterProps {
  theme: { colors: { lightestTransparentBg: string } }
}

interface FooterProps {
  className: string;
  setLang: (lang: string) => void;
  staticPages: { slug: string; title: string }[];
}

const StyledFooter = styled.footer`
  text-align: center;
  padding: 2rem 0;
  font-size: 1rem;
  background-color: ${(props: StyledFooterProps) => props.theme.colors.lightestTransparentBg};
`;

const Footer: React.FC<FooterProps> = ({ className, setLang, staticPages }) => {
  const { getLocalizedString } = useContext(contentContext);

  return (
    <StyledFooter className={className}>
      <Text textAlign="center" fontSize="0.9rem">
        {getLocalizedString('footer-lang_selection_txt')}:{'  '}
        <a
          href="!"
          onClick={(e) => {
            e.preventDefault();
            setLang('en');
          }}
        >
          EN
        </a>{' '}
        |{' '}
        <a
          href="!"
          onClick={(e) => {
            e.preventDefault();
            setLang('fr');
          }}
        >
          FR
        </a>
      </Text>
      <Text textAlign="center" fontSize="0.9rem">
        {staticPages &&
          staticPages.map((page, index, array) => {
            const component = (
              <Link key={page.slug} to={`/${page.slug}`}>
                {page.title}
              </Link>
            );
            if (index < array.length - 1)
              return (
                <span key={page.slug}>
                  {component}
                  {' | '}
                </span>
              );
            else return component;
          })}
      </Text>
      <Text textAlign="center" fontSize="0.9rem">
        <ColoredText>{getLocalizedString('footer-copyright_txt')}</ColoredText>
      </Text>
    </StyledFooter>
  );
};

export default Footer;

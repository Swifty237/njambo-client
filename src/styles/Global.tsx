import { createGlobalStyle } from 'styled-components';


interface GlobalStylesProps {
  theme: {
    colors: {
      secondaryCta: string;
      primaryCta: string;
      lightBg: string;
      lightestBg: string;
      darkBg: string;
      fontColorLight: string;
      fontColorDark: string;
      primaryCtaDarker: string;
    };
    fonts: {
      fontSizeParagraph: string;
      fontSizeRoot: string;
      fontSizeRootMobile: string;
      fontFamilySansSerif: string;
      fontFamilySerif: string;
      fontLineHeight: string;
      fontSizeH1: string;
      fontSizeH2: string;
      fontSizeH3: string;
      fontSizeH4: string;
      fontSizeH5: string;
      fontSizeH6: string;
    };
    other: {
      stdBorderRadius: string;
    };
  }
}

const GlobalStyles = createGlobalStyle`
  :root {
    box-sizing: border-box;
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeRoot};
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: ${(props: GlobalStylesProps) => props.theme.colors.secondaryCta} ${(props: GlobalStylesProps) =>
    props.theme.colors.lightBg};
    box-sizing: inherit;
  }

  *:focus {
    outline: 1px dotted ${(props: GlobalStylesProps) => props.theme.colors.primaryCta};
    outline-offset: 5px;
  }

  *::-webkit-scrollbar {
    width: 0.75rem;
    transition: all 0.3s ease-out;
  }

  *::-webkit-scrollbar-track {
    background: ${(props: GlobalStylesProps) => props.theme.colors.lightBg};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${(props: GlobalStylesProps) => props.theme.colors.secondaryCta};
    border-radius: ${(props: GlobalStylesProps) => props.theme.other.stdBorderRadius};
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: ${(props: GlobalStylesProps) => props.theme.colors.primaryCta};
  }

  ::-moz-selection {
    background: ${(props: GlobalStylesProps) => props.theme.colors.darkBg};
    color: ${(props: GlobalStylesProps) => props.theme.colors.fontColorLight};
  }

  ::selection {
    background: ${(props: GlobalStylesProps) => props.theme.colors.darkBg};
    color: ${(props: GlobalStylesProps) => props.theme.colors.fontColorLight};
  }

  body {
    background-color: ${(props: GlobalStylesProps) => props.theme.colors.lightestBg};
    color: ${(props: GlobalStylesProps) => props.theme.colors.fontColorDark};
    font-family: ${(props: GlobalStylesProps) => props.theme.fonts.fontFamilySansSerif};
    line-height: ${(props: GlobalStylesProps) => props.theme.fonts.fontLineHeight};
    font-weight: 400;
  }

  hr {
    background-color: ${(props: GlobalStylesProps) => props.theme.colors.darkBg};
    height: 1px;
  }

  a {
    text-decoration: none;
    color: ${(props: GlobalStylesProps) => props.theme.colors.primaryCta};
    font-weight: bold;

    &:visited {
      color: ${(props: GlobalStylesProps) => props.theme.colors.primaryCta};
    }

    &:hover {
      color: ${(props: GlobalStylesProps) => props.theme.colors.primaryCtaDarker};
    }

    &:active {
      color: ${(props: GlobalStylesProps) => props.theme.colors.primaryCtaDarker};
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h5 {
    font-family: ${(props: GlobalStylesProps) => props.theme.fonts.fontFamilySerif};
    font-weight: 400;
    margin-bottom: 1.5rem;
  }

  h1,
  .h1 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH1};
  }

  h2,
  .h2 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH2};
  }

  h3,
  .h3 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH3};
  }

  h4,
  .h4 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH4};
  }

  h5,
  .h5 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH5};
  }

  h6,
  .h6 {
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeH6};
  }

  p {
    font-family: ${(props: GlobalStylesProps) => props.theme.fonts.fontFamilySansSerif};
    font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeParagraph};
    font-weight: 400;
    line-height: ${(props: GlobalStylesProps) => props.theme.fonts.fontLineHeight};
    margin-bottom: 1rem;
  }

  input,
  textarea,
  button,
  div,
  select,
  a {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  img {
    width: 100%;
  }

  @media screen and (max-width: 1024px){
    :root{
      font-size: ${(props: GlobalStylesProps) => props.theme.fonts.fontSizeRootMobile};
    }
  }

  @media screen and (max-width: 468px){
    *:focus {
      outline: none;
    }
  }
`;

export default GlobalStyles;

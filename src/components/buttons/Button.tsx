import styled, { css } from 'styled-components';
// import PropTypes from 'prop-types';

interface ButtonProps {
  primary: boolean;
  secondary: boolean;
  large: boolean;
  small: boolean;
  fullWidth: boolean;
  fullWidthOnMobile: boolean;
  theme: any; // Replace 'any' with your theme type if available
}

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.75rem 1.5rem;
  outline: none;
  border: 2px solid rgba(0, 0, 0, 0);
  border-radius: ${(props: ButtonProps) => props.theme.other.stdBorderRadius};
  background-color: ${(props: ButtonProps) => props.theme.colors.goldenColor};
  color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
  font-family: ${(props: ButtonProps) => props.theme.fonts.fontFamilySansSerif};
  font-weight: 400;
  font-size: 1.3rem;
  line-height: 1.3rem;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s;

  &:visited {
    background-color: ${(props: ButtonProps) => props.theme.colors.goldenColorDarker};
    color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
  }

  &:hover,
  &:active {
    background-color: ${(props: ButtonProps) => props.theme.colors.goldenColorDarker};
    color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
    color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
  }

  &:disabled {
    background-color: grey;
    border-color: 2px solid grey;
  }

  ${(props: ButtonProps) =>
    props.primary &&
    css`
      color: ${(props: ButtonProps) => props.theme.colors.primaryCta};
      padding: ${(props: ButtonProps) => {
        if (props.large) return 'calc(1rem - 2px) calc(2rem - 2px)';
        else if (props.small) return 'calc(0.5rem - 2px) calc(1rem - 2px)';
        else return 'calc(0.75rem - 2px) calc(1.5rem - 2px)';
      }};

      &,
      &:visited {
        background-color: ${(props: ButtonProps) => props.theme.colors.primaryCta};
        color: ${(props: ButtonProps) => props.theme.colors.fontColorLight};
      }

      &:hover,
      &:active {
        background-color: ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
        border-color: ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
        color: ${(props: ButtonProps) => props.theme.colors.fontColorLight};
      }

      &:focus {
        color: ${(props: ButtonProps) => props.theme.colors.fontColorLight};
      }

      &:disabled {
        background-color: grey;
        border-color: grey;
        color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
      }
    `}

  ${(props: ButtonProps) =>
    props.secondary &&
    css`
      color: ${(props: ButtonProps) => props.theme.colors.primaryCta};

      &,
      &:visited {
        border: 2px solid ${(props: ButtonProps) => props.theme.colors.primaryCta};
        background-color: transparent;
        color: ${(props: ButtonProps) => props.theme.colors.primaryCta}};
      }

      &:hover,
      &:active {
        border: 2px solid ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
        background-color: transparent;
        color: ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
      }

      &:focus {
        outline: none;
        border: 2px solid ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
        color: ${(props: ButtonProps) => props.theme.colors.primaryCtaDarker};
      }

      &:disabled {
        border: 2px solid grey;
        background-color: grey;
        color: ${(props: ButtonProps) => props.theme.colors.fontColorDark};
      }
    `}
  
  ${(props: ButtonProps) =>
    props.large &&
    css`
      font-size: 1.6rem;
      line-height: 1.6rem;
      min-width: 250px;
      padding: 1rem 2rem;
    `}
  
  ${(props: ButtonProps) =>
    props.small &&
    css`
      font-size: 1.1rem;
      line-height: 1.1rem;
      min-width: 125px;
      padding: 0.5rem 1rem;
    `}
  
  ${(props: ButtonProps) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}

    @media screen and (max-width: 1024px) {
    ${(props: ButtonProps) =>
    props.large &&
    css`
        font-size: 1.4rem;
        line-height: 1.4rem;
        min-width: 250px;
        padding: 0.75rem 1.5rem;
      `}

    ${(props: ButtonProps) =>
    (props.fullWidthOnMobile || props.fullWidth) &&
    css`
        width: 100%;
      `}
  }
`;

// Button.propTypes = {
//   primary: PropTypes.bool,
//   secondary: PropTypes.bool,
//   small: PropTypes.bool,
//   large: PropTypes.bool,
//   fullWidth: PropTypes.bool,
//   fullWidthOnMobile: PropTypes.bool,
// };

export default Button;

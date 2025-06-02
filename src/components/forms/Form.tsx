import styled from 'styled-components';
import { ThemeProps } from '../../styles/theme';

interface FormProps {
  theme: ThemeProps;
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 480px;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  text-align: center;

  @media screen and (min-width: 1024px) {
    background-color: ${(props: FormProps) => props.theme.colors.lightBg};
    border-radius: ${(props: FormProps) => props.theme.other.stdBorderRadius};
    padding: 1.5rem;
    max-width: 580px;
    box-shadow: ${(props: FormProps) => props.theme.other.cardDropShadow};
  }
`;

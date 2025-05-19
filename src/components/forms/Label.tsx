import styled from 'styled-components';

interface InputProps {
  theme: {
    fonts: {
      fontSizeParagraph: string,
    }
  }
}


export const Label = styled.label`
  text-align: left;
  display: inline-block;
  padding-left: 0.25rem;
  margin: 0.25rem 0;
  font-size: ${(props: InputProps) => props.theme.fonts.fontSizeParagraph};
`;

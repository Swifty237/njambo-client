import styled from 'styled-components';

interface SelectProps {
  theme: {
    colors: {
      playingCardBgLighter: string,
      primaryCta: string,
      secondaryCta: string
    },
    other: {
      stdBorderRadius: string,
    }
  }
}

export const Select = styled.select`
  height: 40px;
  overflow: hidden;
  padding: 0 0.5rem;
  text-align: right;
  font-size: 1.1rem;
  border: none;
  border-radius: calc(
    ${(props: SelectProps) => props.theme.other.stdBorderRadius} - 1.25rem
  );
  background-color: ${(props: SelectProps) => props.theme.colors.playingCardBgLighter};
  border-color: ${(props: SelectProps) => props.theme.colors.secondaryCta};
  color: ${(props: SelectProps) => props.theme.colors.primaryCta};
  width: 100%;

  &:focus {
    outline: none;
    border-width: 3px;
    border-color: ${(props: SelectProps) => props.theme.colors.primaryCta};
  }
`;

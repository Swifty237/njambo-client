import styled from 'styled-components';

interface HandProps {
  hiddenCards?: boolean;
}

export const Hand = styled.div<HandProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 55;

  * ~ * {
    margin-left: ${(props: HandProps) => props.hiddenCards ? '-2.25rem' : '-1.25rem'};
  }
`;

import styled from 'styled-components';

interface CenteredAnchorProps {
  width?: string;
  height?: string;
}

export const CenteredAnchor = styled.div`
  width: ${({ width }: CenteredAnchorProps) => width};
  height: ${({ height }: CenteredAnchorProps) => height};
  position: absolute;
  top: 50%;
  left: 50%;
`;

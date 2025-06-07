import styled from 'styled-components';

interface PositionedUISeatProps {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

export const PositionedUISeat = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: ${({ top }: PositionedUISeatProps) => top};
    right: ${({ right }: PositionedUISeatProps) => right};
    bottom: ${({ bottom }: PositionedUISeatProps) => bottom};
    left: ${({ left }: PositionedUISeatProps) => left};
`;

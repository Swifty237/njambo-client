import styled from 'styled-components';

interface PositionedUISlotProps {
  width: string;
  height: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
  origin: string;
  scale: number | string;
}

export const PositionedUISlot = styled.div`
  width: ${({ width }: PositionedUISlotProps) => width || 'auto'};
  height: ${({ height }: PositionedUISlotProps) => height || 'auto'};
  position: absolute;
  top: ${({ top }: PositionedUISlotProps) => top};
  right: ${({ right }: PositionedUISlotProps) => right};
  bottom: ${({ bottom }: PositionedUISlotProps) => bottom};
  left: ${({ left }: PositionedUISlotProps) => left};
  transform-origin: ${({ origin }: PositionedUISlotProps) => origin || 'top left'};
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  @media screen and (max-width: 1068px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.3})` || '1'};
  }

  @media screen and (max-width: 968px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.25})` || '1'};
  }

  @media screen and (max-width: 868px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.2})` || '1'};
  }

  @media screen and (max-width: 812px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.15})` || '1'};
  }

  @media screen and (max-width: 668px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.1})` || '1'};
  }

  @media screen and (max-width: 648px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${+scale + 0.05})` || '1'};
  }

  @media screen and (max-width: 568px) {
    transform: ${({ scale }: PositionedUISlotProps) => `scale(${scale})` || '1'};
  }
`;

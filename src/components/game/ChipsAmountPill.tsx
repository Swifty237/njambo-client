import React from 'react';
import PokerChip from '../icons/PokerChip';
import styled from 'styled-components';
import ColoredText from '../typography/ColoredText';
import theme from '../../styles/theme';
import { useChipsPosition } from '../../hooks/useChipsPosition';

interface ChipsAmountPillProps {
  chipsAmount: number;
  seatPosition?: '1' | '2' | '3' | '4';
}

interface WrapperProps {
  seatPosition?: '1' | '2' | '3' | '4';
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

// CORRECTION 2: Interface correcte pour CurrencySpan
interface FontSizeProps {
  fontSize: string;
}

// CORRECTION 1: Ajout du type générique avec types explicites
const Wrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  min-width: 85px;
  max-width: 85px;
  transition: all 0.3s ease;
  padding: 5px;
  
  /* Application des positions dynamiques avec fallbacks */
`;

const CurrencySpan = styled.span<FontSizeProps>`
  font-size: ${(props: FontSizeProps) => props.fontSize};
  margin-left: 2px;
`;

// CORRECTION 3: Interface correcte pour TextWrapper
const TextWrapper = styled.span<FontSizeProps>`
  font-size: ${(props: FontSizeProps) => props.fontSize};
`;

const IconWrapper = styled.label`
  position: relative;
  z-index: 5;
`;

const ChipsAmountPill: React.FC<ChipsAmountPillProps> = ({ chipsAmount, seatPosition = "1" }) => {
  // Utilisation du hook pour obtenir les positions et tailles
  const { getChipsPosition, getChipsSize } = useChipsPosition();

  // Obtenir la position pour ce siège
  const position = getChipsPosition(seatPosition);

  // Obtenir la taille appropriée pour cet écran
  const { width, height, fontSize } = getChipsSize();

  return (
    <Wrapper position={position}>
      <IconWrapper htmlFor="chipsAmount">
        <PokerChip
          width={width}
          height={height}
          viewBox="7 7 20 20"
          injectedTheme={theme.colors.primaryCtaDarker}
        />
      </IconWrapper>

      <TextWrapper fontSize={fontSize}>
        <ColoredText primary>
          {new Intl.NumberFormat(document.documentElement.lang).format(chipsAmount)}
          <CurrencySpan fontSize={`calc(${fontSize} * 0.8)`}>
            {" XAF"}
          </CurrencySpan>
        </ColoredText>
      </TextWrapper>
    </Wrapper>
  );
};

export default ChipsAmountPill;
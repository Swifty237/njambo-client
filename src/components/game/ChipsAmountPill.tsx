import React from 'react';
import PokerChip from '../icons/PokerChip';
// import { Input } from '../forms/Input';
import styled, { css } from 'styled-components';
import ColoredText from '../typography/ColoredText';
import theme from '../../styles/theme';

interface ChipsAmountPillProps {
  chipsAmount: number;
  position?: '1' | '2' | '3' | '4';
}

interface WrapperProps {
  position?: '1' | '2' | '3' | '4';
}

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  min-width: 85px;
  
  ${(props: WrapperProps) => {
    switch (props.position) {
      case '1':
        return css`

        @media screen and (max-width: 1370px) and (max-height: 915px) {
          top: 35px;
          left: 15px
        }

        @media screen and (max-width: 1345px) and (max-height: 1010px) {
          top: 35px;
          left: 45px
        }

        @media screen and (max-width: 1065px) and (max-height: 530px) {
          top: 70px;
          left: 15px
        }
        
        @media screen and (max-width: 935px) and (max-height: 435px) {
          top: 35px;
        }

        @media screen and (max-width: 775px) and (max-height: 523px) {
          top: 25px
        }

        @media screen and (max-width: 775px) and (max-height: 480px) {
          top: 35px
        }

        @media screen and (max-width: 775px) and (max-height: 340px) {
          top: 45px
        }

        @media screen and (max-width: 670px) and (max-height: 375px) {
          top: 22px;
          left: 10px
        }

        @media screen and (max-width: 640px) and (max-height: 565px) {
          left: 5px
        }
        `;
      case '2':
        return css`
        right: 50px;
          
          @media screen and (max-width: 1370px) and (max-height: 915px) {
            top: -15px;
            right: 30px;
          }

           @media screen and (max-width: 1370px) and (max-height: 775px) {
            top: 10px;
            right: 30px;
          }

          @media screen and (max-width: 1370px) and (max-height: 625px) {
            top: -45px;
            right: 150px;
          }


          @media screen and (max-width: 1185px){
            top: -35px;
            right: 50px;
          }

          @media screen and (max-width: 1185px) and (max-height: 825px) {
            top: 0px;
            right: 50px;
          }

           @media screen and (max-width: 1185px) and (max-height: 650px) {
            top: 20px;
            right: 50px;
          }

           @media screen and (max-width: 1165px) and (max-height: 525px) {
            top: -45px;
            right: 150px;
          }


          @media screen and (max-width: 1025px) and (max-height: 770px) {
            top: -15px;
            right: 30px;
          }

          @media screen and (max-width: 1025px) and (max-height: 605px) {
            top: -45px;
            right: 100px;
          }

          @media screen and (max-width: 935px) and (max-height: 435px) {
            top: -40px;
            right: 100px
          }

          @media screen and (max-width: 745px) and (max-height: 365px) {
            right: 70px
          }

          @media screen and (max-width: 670px) and (max-height: 380px) {
            top: -40px;
            right: 70px
          }

          @media screen and (max-width: 725px) and (max-height: 545px) {
            top: -40px;
            right: 70px
          }
          `;
      case '3':
        return css`
          top: -160px;
          right: 50px;

          @media screen and (max-width: 1370px) and (max-height: 915px) {
            top: -140px;
            right: 30px;
          }

           @media screen and (max-width: 1185px) and (max-height: 825px) {
            top: -120px;
            right: 50px;
          }

          @media screen and (max-width: 1185px) and (max-height: 650px) {
            top: -100px;
            right: 20px;
          }

           @media screen and (max-width: 1165px) and (max-height: 525px) {
            top: -80px;
            right: 20px;
          }

          @media screen and (max-width: 1025px) and (max-height: 770px) {
            top: -100px;
            right: 30px;
          }

          @media screen and (max-width: 1025px) and (max-height: 525px) {
            top: -80px;
            right: 10px;
          }

          @media screen and (max-width: 935px) and (max-height: 435px) {
            top: -70px;
            right: 5px
          }

          @media screen and (max-width: 725px) and (max-height: 545px) {
            top: -80px;
            right: -10px
          }

          @media screen and (max-width: 670px) and (max-height: 380px) {
            top: -70px;
            right: 5px
          }
        `;
      case '4':
        return css`
        top: -50px;
        left: 50px;

         @media screen and (max-width: 1370px) and (max-height: 650px) {
            top: -20px;
            left: 130px
        }

        @media screen and (max-width: 1185px) and (max-height: 650px) {
          top: -20px;
        }

        @media screen and (max-width: 1025px) and (max-height: 770px) {
            top: -50px;
            left: 40px;
          }

          @media screen and (max-width: 1025px) and (max-height: 525px) {
            top: 1px;
            left: 110px;
          }

        @media screen and (max-width: 935px) and (max-height: 435px) {
            top: 1px;
            left: 90px
          }

          @media screen and (max-width: 800px) and (max-height: 525px) {
            top: 1px;
            left: 80px
          }

          @media screen and (max-width: 745px) and (max-height: 365px) {
            top: 1px;
            left: 75px
          }

          @media screen and (max-width: 725px) and (max-height: 545px) {
            top: -10px;
            left: 65px;
          }

          @media screen and (max-width: 725px) and (max-height: 350px) {
            top: -20px;
            left: 65px;
          }

        @media screen and (max-width: 670px) and (max-height: 380px) {
            top: -10px;
            left: 55px
          }

          @media screen and (max-width: 550px) {
            top: -20px;
          }
        `;
      default:
        return '';
    }
  }}
`;


const CurrencySpan = styled.span`
  font-size: 10px;
  margin-left: 2px;
`;

const TextWrapper = styled.span`
  font-size: 15px;
`;

const IconWrapper = styled.label`
  position: relative;
  z-index: 5;
`;

const ChipsAmountPill: React.FC<ChipsAmountPillProps> = ({ chipsAmount, position }) => {
  return (
    <Wrapper position={position}>
      <IconWrapper htmlFor="chipsAmount">
        <PokerChip width="25" height="25" viewBox="7 7 20 20" injectedTheme={theme.colors.primaryCtaDarker} />
      </IconWrapper>

      <TextWrapper>
        <ColoredText primary>
          {new Intl.NumberFormat(document.documentElement.lang).format(chipsAmount)}
          <CurrencySpan >{"F CFA"}</CurrencySpan>
        </ColoredText>
      </TextWrapper>
    </Wrapper>
  );
};

export default ChipsAmountPill;

// import PropTypes from 'prop-types';
import styled from 'styled-components';

interface StyledHeadingProps {
  headingClass?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  theme: { fonts: any } // => A typer proprement
  textCentered?: boolean;
  textCenteredOnMobile?: boolean;
}

const Heading = styled.h1`
  font-size: ${(props: StyledHeadingProps) =>
    props.headingClass
      ? props.theme.fonts[`fontSize${props.headingClass.toUpperCase()}`]
      : props.theme.fonts.fontSizeH1};

  text-align: ${(props: StyledHeadingProps) => (props.textCentered ? 'center' : 'left')};

  @media screen and (max-width: 1024px) {
    text-align: ${(props: StyledHeadingProps) =>
    props.textCenteredOnMobile || props.textCentered ? 'center' : 'left'};
  }
`;

// Heading.propTypes = {
//   headingClass: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
//   textCentered: PropTypes.bool,
//   textCenteredOnMobile: PropTypes.bool,
// };

Heading.defaultProps = {
  textCentered: false,
  textCenteredOnMobile: false,
};

export default Heading;

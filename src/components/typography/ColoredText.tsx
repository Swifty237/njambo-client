import styled from 'styled-components';
// import PropTypes from 'prop-types';

interface ColoredTextProps {
  emphazised: boolean;
  secondary: boolean;
  theme: {
    colors: {
      secondaryCta: string;
      primaryCta: string;
    }
  }
}

const ColoredText = styled.span`
  color: ${(props: ColoredTextProps) => {
    if (props.secondary) {
      return props.theme.colors.secondaryCta;
    } else {
      return props.theme.colors.primaryCta;
    }
  }};
  font-weight: ${(props: ColoredTextProps) => (props.emphazised ? 'bold' : 'normal')};
`;

// ColoredText.propTypes = {
//   emphazised: PropTypes.bool,
//   secondary: PropTypes.bool,
// };

ColoredText.defaultProps = {
  emphazised: false,
  secondary: false,
};

export default ColoredText;

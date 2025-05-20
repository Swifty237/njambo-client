import styled from 'styled-components';
// import PropTypes from 'prop-types';

interface TextProps {
  theme: {
    colors: { primaryCta: string };
    other: { stdBorderRadius: string }
    fontFamilySansSerif: string;
    fontSizeParagraph: string;
    fontLineHeight: string;
  };
  textAlign: string;
  fontSize: string;
}

const Text = styled.p`
  font-family: ${(props: TextProps) => props.theme.fontFamilySansSerif};
  text-align: ${(props: TextProps) => props.textAlign};
  font-size: ${(props: TextProps) =>
    props.fontSize ? props.fontSize : props.theme.fontSizeParagraph};
  font-weight: 400;
  line-height: ${(props: TextProps) => props.theme.fontLineHeight};
  margin-bottom: 1rem;
`;

// Text.propTypes = {
//   fontSize: PropTypes.string,
//   textAlign: PropTypes.oneOf(['left', 'center', 'right']),
// };

Text.defaultProps = {
  textAlign: 'left',
};

export default Text;

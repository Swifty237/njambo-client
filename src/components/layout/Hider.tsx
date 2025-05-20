import styled, { css } from 'styled-components';
// import PropTypes from 'prop-types';

interface HiderProps {
  hideOnDesktop: boolean,
  hideOnMobile: boolean,
}

const Hider = styled.div`
  display: none;

  ${(props: HiderProps) =>
    props.hideOnMobile &&
    css`
      display: initial;

      @media screen and (max-width: 1024px) {
        display: none;
      }
    `}

  ${(props: HiderProps) =>
    props.hideOnDesktop &&
    css`
      @media screen and (max-width: 1024px) {
        display: flex;
      }
    `}
`;

// Hider.propTypes = {
//   hideOnDesktop: PropTypes.bool,
//   hideOnMobile: PropTypes.bool,
// };

export default Hider;

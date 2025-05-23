import styled, { css } from 'styled-components';

interface ContainerProps {
  contentCenteredMobile?: boolean;
  fluid?: boolean;
  fullHeight?: boolean;
  margin?: string;
  padding?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  display?: string;
}

const Container = styled.div`
  display: ${(props: ContainerProps) => props.display};
  position: relative;
  flex-direction: ${(props: ContainerProps) => props.flexDirection};
  justify-content: ${(props: ContainerProps) => props.justifyContent};
  align-items: ${(props: ContainerProps) => props.alignItems};
  max-width: 1440px;
  margin: ${(props: ContainerProps) => props.margin};
  padding: ${(props: ContainerProps) => props.padding};

  @media screen and (max-width: 1024px) {
    justify-content: ${(props: ContainerProps) =>
    props.contentCenteredMobile ? 'center' : 'space-between'};
    padding-left: 1rem;
    padding-right: 1rem;
  }

  ${(props: ContainerProps) =>
    props.fluid &&
    css`
      max-width: 100%;
      width: 100%;
      padding: 0 3rem;
    `}

  ${(props: ContainerProps) =>
    props.fullHeight &&
    css`
      min-height: 100vh;
    `}
`;

Container.defaultProps = {
  contentCenteredMobile: false,
  fluid: false,
  fullHeight: false,
  margin: '0 auto',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '0 2rem',
  display: 'flex',
};

export default Container;

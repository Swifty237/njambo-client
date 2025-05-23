import styled from 'styled-components';

interface CenteredBlockProps {
  direction: 'column' | 'row';
}


const CenteredBlock = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props: CenteredBlockProps) => props.direction};
  justify-content: center;
  overflow-x: hidden;
`;

CenteredBlock.defaultProps = {
  direction: 'column',
};

export default CenteredBlock;

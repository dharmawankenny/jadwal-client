import React from 'react';
import styled from 'styled-components';

export default function Card(props) {
  const { width = '100%', padding = '1rem', lite = false } = props;

  return (
    <CardWrapper width={width} padding={padding} lite={lite}>
      {props.children}
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: ${props => props.width};
  padding: ${props => props.padding};
  background: #FFF;
  border-radius: 0.5rem;
  box-shadow: ${props => props.lite ?
    '0px 3px 8px rgba(4, 23, 33, 0.15)' :
    '0px 6px 16px rgba(4, 23, 33, 0.15)'};
`;

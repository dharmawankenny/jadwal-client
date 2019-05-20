import React from 'react';
import styled from 'styled-components';

export default function PageLoader(props) {
  return (
    <Loader active={props.isLoading}>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      <h1>Initiating<span>🚀</span>Propellers</h1>
    </Loader>
  );
}

const Loader = styled.div`
  background: #FAFAFA;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 5rem;
  transform: translate3d(0, ${props => props.active ? '0' : '100%'}, 0);
  opacity: ${props => props.active ? 1 : 0};
  transition: ${props => props.active ?
    '0.37s ease opacity 0.125s, 0.375s ease transform' :
    '0.375s ease opacity 0.5s, 0.375s ease transform 0.375s'};

  h1 {
    width: 100%;
    font-size: 7.5rem;
    margin: 1rem 0 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    line-height: 3.5rem;
    color: #1E3C72;
    opacity: ${props => props.active ? 1 : 0};
    transition: 0.375s ease all;

    span {
      width: 100%;
      margin: 0 1rem;
      font-size: 10rem;
    }
  }
  
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 4rem;
    height: 4rem;
    opacity: ${props => props.active ? 1 : 0};
    transition: 0.375s ease all;

    div {
      position: absolute;
      top: 1.5rem;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: #1E3C72;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);

      &:nth-child(1) {
        left: 0.25rem;
        animation: lds-ellipsis1 0.6s infinite;
      }
      &:nth-child(2) {
        left: 0.25rem;
        animation: lds-ellipsis2 0.6s infinite;
      }
      &:nth-child(3) {
        left: 1.5rem;
        animation: lds-ellipsis2 0.6s infinite;
      }
      &:nth-child(4) {
        left: 2.75rem;
        animation: lds-ellipsis3 0.6s infinite;
      }
    }
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(1.25rem, 0);
    }
  }  
`;

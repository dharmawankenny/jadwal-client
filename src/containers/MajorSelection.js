import React, { useState } from 'react';
import styled from 'styled-components';

import LogoIcon from '../statics/logo.svg';

import useMajors from '../hooks/useMajors';

import Card from '../components/Card';
import useBase from '../hooks/useBase';

export default function MajorSelection() {
  const [selectedMajor, setSelectedMajor] = useState('');
  const [_, { selectBaseMajor }] = useBase();
  const [majorsState] = useMajors();

  return (
    <Wrapper>
      <LogoDesc>
        <img src={LogoIcon} />
        <p>Atur jadwal semestermu dengan mudah, pilih mata kuliah yang ingin kamu ambil dan siapkan jadwal pilihanmu sebelum pemilihan mata kuliah dimulai.</p>
      </LogoDesc>
      <Card width="30rem" padding="1rem">
        <SelectWithLabel>
          <label htmlFor="majorSelector">Fakultas — Jurusan</label>
          <div>
            <select name="majorSelector" value={selectedMajor} onChange={evt => setSelectedMajor(evt.target.value)}>
              {majorsState.isLoading && <option>Loading ...</option>}
              {majorsState.majors.map(major => <option key={major.id} value={major.id}>{major.faculty} — {major.major}</option>)}
            </select>
          </div>
        </SelectWithLabel>
        <SelectMajor onClick={() => (!majorsState.isLoading && selectBaseMajor(selectedMajor === '' ? majorsState.majors[0].id : selectedMajor))}>
          Lihat Jadwal —>
        </SelectMajor>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: calc(1200px + 4rem);
  min-height: 100vh;
  padding: 2rem;
  margin: 0 auto;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const LogoDesc = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 0 3rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  align-content: center;

  img {
    height: 5rem;
    width: auto;
  }

  p {
    width: 100%;
    margin: 2rem 0 0;
    text-align: center;
    font-size: 1rem;
    line-height: 1.5;
    color: #84898C;
  }
`;

const SelectWithLabel = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  align-content: center;

  label,
  select {
    width: 100%;
  }

  label {
    color: #84898C;
    font-size: 0.75rem;
    line-height: 1.5;
    font-weight: 400;
    margin: 0 0 0.25rem;
  }

  div {
    display: flex;
    width: 100%;
    background: #FAFAFA;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    select {
      color: #1E3C72;
      width: 100%;
      background: none;
      border: none;
      outline: none;
      padding: 0;
      font-size: 1rem;
      line-height: 1;
    }
  }
`;

const SelectMajor = styled.div`
  width: 100%;
  margin: 1rem 0 0;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  color: #FFF;
  background: linear-gradient(107.28deg, #FF9A44 0%, #FC6076 100%);
  transition: 0.25s ease all;
  box-shadow: 0px 0.2rem 0.5rem rgba(4, 23, 33, 0.15);
  border: none;
  border-radius: 0.5rem;
  outline: none;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
    transition: 0.25s ease all;
  }
`;

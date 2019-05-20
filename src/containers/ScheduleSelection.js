import React, { useState } from 'react';
import styled from 'styled-components';

import LogoIcon from '../statics/logo.svg';
import SearchIcon from '../statics/search.svg';
import AddIcon from '../statics/add.svg';
import CheckIcon from '../statics/check.svg';

import useBase from '../hooks/useBase';
import useSchedules from '../hooks/useSchedules';
import useMajors from '../hooks/useMajors';

import Card from '../components/Card';

const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function ScheduleSelection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [{ selectedMajor }, { selectBaseMajor }] = useBase();
  const [{ majors }] = useMajors();
  const [{ schedules }] = useSchedules();

  const majorInfo = majors.find(major => selectedMajor === major.id);
  const selectedScheduleList = schedules[selectedMajor];

  if (!majorInfo || !selectedScheduleList) return null;

  return (
    <Wrapper>
      <LogoDesc>
        <img src={LogoIcon} />
        <p>Atur jadwal semestermu dengan mudah, pilih mata kuliah yang ingin kamu ambil dan siapkan jadwal pilihanmu sebelum pemilihan mata kuliah dimulai.</p>
      </LogoDesc>
      <ScheduleListHeader>
        <h6>Memperlihatkan jadwal untuk:</h6>
        <h1>{majorInfo.faculty} — {majorInfo.major}, {selectedScheduleList.semester}</h1>
        <button onClick={() => selectBaseMajor('')}>Pilih Jurusan Lain —></button>
        <h3>Terdapat <strong>{selectedScheduleList.courseCount}</strong> Mata Kuliah dan <strong>{selectedScheduleList.classCount}</strong> Kelas, Data diperbaharui 5 menit yang lalu.</h3>
        <Card>
          <div className="searchBox">
            <input type="text" value={searchQuery} onChange={evt => setSearchQuery(evt.target.value)} placeholder="Masukan nama mata kuliah, term: 1/2/.../8, atau SKS: jumlah." />
            <img src={SearchIcon} />
          </div>
        </Card>
      </ScheduleListHeader>
      {Object.values(selectedScheduleList.courses).map(courseClass => <Course {...courseClass} />)}
    </Wrapper>
  );
}

function Course(props) {
  const [{ selectedMajor, selectedSchedule }, { setSchedule, deleteSchedule }] = useBase();
  return (
    <Card padding="2rem">
      <CourseHeader>
        <h1>{props.courseName}</h1>
        <h2><strong>{props.courseCredits}</strong> SKS, Term <strong>{props.courseTerm}</strong></h2>
        <h3>{props.courseId} — {props.courseCurriculum} — {props.coursePreRequisite}</h3>
        <h6>Kelas tersedia:</h6>
      </CourseHeader>
      {Object.values(props.courseClasses).map(courseClass => (
        <CourseClass>
          <div className="classDetail">
            <h1>{courseClass.className}</h1>
            <h6>Pengajar:</h6>
            <h2>{courseClass.classLecturer}</h2>
          </div>
          <div className="classSchedules">
            {courseClass.classSchedules.map(classSchedule => (
              <div className="classSchedule">
                <h3>{DAY_NAMES[classSchedule.day]}, {classSchedule.startTime} — {classSchedule.endTime}</h3>
                <h4>{classSchedule.location}</h4>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (props.courseId in selectedSchedule[selectedMajor] &&
                selectedSchedule[selectedMajor][props.courseId] === courseClass.className) {
                deleteSchedule({ courseId: props.courseId });
              } else {
                setSchedule({ courseId: props.courseId, classId: courseClass.className });
              }
            }}
            className={(props.courseId in selectedSchedule[selectedMajor] &&
              selectedSchedule[selectedMajor][props.courseId] === courseClass.className) && 'active'}
          >
            <img
              src={(props.courseId in selectedSchedule[selectedMajor] &&
                selectedSchedule[selectedMajor][props.courseId] === courseClass.className) ?
                  CheckIcon : AddIcon}
            />
          </button>
        </CourseClass>
      ))}
    </Card>
  )
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  margin: 0 auto;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
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

const ScheduleListHeader = styled.div`
  width: 100%;
  margin: 6rem 0 2rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  h1,
  h3,
  h6 {
    margin: 0;
    line-height: 1.5;
    text-align: left;
  }

  h1 {
    flex: 1;
    font-size: 1.5rem;
    color: #1E3C72;
  }

  h3,
  h6 {
    width: 100%;
    font-weight: 400;
    color: #84898C;
  }

  h6 {
    font-size; 0.75rem;
  }

  h3 {
    font-size: 0.75rem;
    margin: 2rem 0 0.5rem;
  }

  button {
    margin: 0 0 0 1rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    color: #FFF;
    background: linear-gradient(97.95deg, #2A5298 0%, #1E3C72 100%);
    box-shadow: 0px 3px 8px rgba(4, 23, 33, 0.15);
    border-radius: 8px;
    border: none;
    border-radius: 0.5rem;
    outline: none;
    cursor: pointer;
  
    &:hover {
      opacity: 0.85;
      transition: 0.25s ease all;
    }
  }

  .searchBox {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  
    input {
      flex: 1;
      padding: 0;
      margin: 0;
      color: #1E3C72;
      background: none;
      border: none;
      outline: none;
      font-size: 1rem;
      margin-right: 1rem;
    }

    img {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const CourseHeader = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  h1,
  h2,
  h3,
  h6 {
    line-height: 1.5;
  }

  h1 {
    flex: 1;
    margin: 0 1rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1E3C72;
    text-align: left;
  }

  h2 {
    font-size: 1rem;
    font-weight: 400;
    color: #84898C;
    margin: 0;

    strong {
      font-weight: 700;
      color: #1E3C72;
    }
  }

  h3 {
    width: 100%;
    color: #84898C;
    font-size: 1rem;
    font-weight: 400;
    text-align: left;
    margin: 0 0 2rem;
  }

  h6 {
    width: 100%;
    color: #84898C;
    font-size: 0.75rem;
    font-weight: 400;
    text-align: left;
    margin: 0;
  }
`;

const CourseClass = styled.div`
  margin: 0 0 1rem;
  background: #FAFAFA;
  border-radius: 0.5rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;

  &:last-of-type {
    margin: 0;
  }

  .classDetail,
  .classSchedules {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }

  .classDetail {
    padding: 1.5rem;

    h1,
    h2,
    h6 {
      width: 100%;
      margin: 0;
      line-height: 1.5;
      text-align: left;
    }

    h1,
    h2 {
      color: #1E3C72;
      font-weight: 700;
    }

    h1 {
      font-size: 1.25rem;
      margin: 0 0 1rem; 
    }

    h2 {
      font-size: 1rem;
    }

    h6 {
      font-size: 0.75rem;
      font-weight: 400;
      color: #84898C;
    }
  }

  .classSchedule {
    width: 100%;
    background: #F3F3F3;
    padding: 1.5rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    border-top: 0.1rem solid #EEE;

    &:first-of-type {
      border-radius: 0.5rem 0 0 0;
      border-top: none;
    }

    &:last-of-type {
      border-radius: 0 0 0 0.5rem;
    }

    h3,
    h4 {
      font-size: 1rem;
      line-height: 1;
      margin: 0;
      color: #1E3C72;
    }

    h3 {
      flex: 1;
      margin-right: 1rem;
    }
  }

  button {
    padding: 0.75rem;
    background: linear-gradient(139.93deg, #FF9A44 0%, #FC6076 100%);
    border-radius: 0 0.5rem 0.5rem 0;
    transition: 0.25s ease all;
  
    &:hover {
      opacity: 0.85;
      transition: 0.25s ease all;
    }

    img {
      width: 1.5rem;
      height: 1.5rem;
    }

    &.active {
      background: linear-gradient(139.93deg, #9BE15D 0%, #00E3AE 47.92%);
    }
  }
`;

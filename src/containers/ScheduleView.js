import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import CloseIcon from '../statics/close.svg';

import useBase from '../hooks/useBase';
import useSchedules from '../hooks/useSchedules';

import { getSelectedClasses, getConflictingSchedules, countTotalSKS, countTotalSchedules, dayMap, flattenClassSchedules } from '../utils/utils';

import Card from '../components/Card';

export default function ScheduleView() {
  const [isActive, setIsActive] = useState(false);
  const [{ selectedMajor, selectedSchedule }, { deleteSchedule }] = useBase();
  const [{ isLoading, schedules }] = useSchedules();

  useEffect(() => {
    document.body.style.overflow = isActive ? 'hidden' : 'auto';
  }, [isActive]);


  const selectedClasses = getSelectedClasses(selectedSchedule[selectedMajor], schedules[selectedMajor].courses);
  const conflicts = getConflictingSchedules(selectedSchedule[selectedMajor], schedules[selectedMajor].courses);
  const hasConflicts = conflicts.length > 0;

  return (
    <>
      <Toggler
        active={selectedSchedule[selectedMajor] && Object.keys(selectedSchedule[selectedMajor]).length > 0}
        onClick={() => setIsActive(true)}
        hasConflicts={hasConflicts}
      >
        {Object.keys(selectedSchedule[selectedMajor]).length} Kelas Dipilih —>
      </Toggler>
      <Content active={isActive} hasConflicts={hasConflicts}>
        <div className="wrapper">
          <div className="content">
            <div className="selectedSchedules">
              <h6>Daftar Kelas</h6>
              <div>
                {selectedClasses.map(selectedClass => (
                  <Card margin="0 0 1.5rem" lite>
                    <h1>{selectedClass.className}</h1>
                    <h5>Pengajar</h5>
                    <h2>{selectedClass.classLecturer}</h2>
                    {selectedClass.classSchedules.map(classSchedule => (
                      <div className="classSchedule">
                        <h3>{dayMap[classSchedule.day]}, {classSchedule.startTime} — {classSchedule.endTime}</h3>
                        <h4>{classSchedule.location}</h4>
                      </div>
                    ))}
                    <button onClick={() => deleteSchedule({ courseId: selectedClass.courseId })}>
                      <img src={CloseIcon} /> Hapus Kelas
                    </button>
                  </Card>
                ))}
              </div>
            </div>
            <div className="timeTable">
              <h6>Jadwal</h6>
              <TimeTable selectedClasses={selectedClasses} />
            </div>
          </div>
        </div>
        <div className="statusBar">
          <div className="wrapper">
            <div className="statusBarContent">
              <h1>{Object.keys(selectedSchedule[selectedMajor]).length} Kelas Dipilih</h1>
              <h2>
                <span>{countTotalSKS(selectedClasses)} SKS</span> —{' '}
                <span>{countTotalSchedules(selectedClasses)} Jadwal</span> —{' '}
                <span>{hasConflicts ? 'Terdapat konflik jadwal' : 'Tidak ada konflik.'}</span>
              </h2>
              <button onClick={() => setIsActive(false)}>Kembali ke daftar kelas<img src={CloseIcon} /></button>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}

const DAYS = dayMap.slice(0, 6);
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const X_OFFSETS = ['8%', '24%', '40%', '56%', '72%', '88%', '88%'];

function TimeTable(props) {
  const { selectedClasses } = props;
  const classSchedules = flattenClassSchedules(selectedClasses)

  return (
    <TableWrapper>
      <TableBase>
        <div className="row header">
          <div className="yAxis" />
          {DAYS.map((day, idx) => (
            <div className={idx === 5 ? 'saturday' : 'workday'}>
              <h1>{day}</h1>
            </div>
          ))}
        </div>
        {HOURS.map(hour => (
          <div className="row">
            <div className="yAxis">
              <span>{hour > 9 ? hour : `0${hour}`}</span>
              <div />
              <span>00</span>
            </div>
            {DAYS.map((day, idx) => (
              <div className={idx === 5 ? 'saturday' : 'workday'} />
            ))}
          </div>
        ))}
      </TableBase>
      {classSchedules.map(classSchedule => (
        <ClassSchedule
          style={{
            height: getHeight(classSchedule.duration),
            top: getYOffset(classSchedule.startTime),
            left: X_OFFSETS[classSchedule.day],
          }}
        >
          <Card width="calc(100% - 1rem)" height="calc(100% - 0.5rem)" margin="0.5rem 0.5rem 0 0.45rem" padding="0.5rem" lite>
            <h1>{classSchedule.className}</h1>
            <h2>{classSchedule.location}, {classSchedule.startTime} — {classSchedule.endTime}</h2>
          </Card>
        </ClassSchedule>
      ))}
    </TableWrapper>
  );
}

const BASE_Y_OFFSET = 2.5;
const CELL_HEIGHT = 4;

function getYOffset(startTime) {
  const [h] = startTime.split(':');

  return `${(Number(h) - 8) * CELL_HEIGHT + BASE_Y_OFFSET}rem`;
}

function getHeight(duration) {
  return `${(Number(duration) / 60) * CELL_HEIGHT}rem`;
}

const ClassSchedule = styled.div`
  position: absolute;
  width: 16%;

  h1,
  h2 {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    line-height: 1.5;
    color: #1E3C72;
  }

  h1 {
    font-size: 0.75rem;
    font-weight: 700;
  }

  h2 {
    font-size: 0.5rem;
    font-weight: 400;
  }
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 0 2rem;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
`;

const TableBase = styled.div`
  width: 100%;

  .row {
    width: 100%;
    height: 4rem;
    border-bottom: 0.1rem solid #EEE;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: stretch;
    align-content: stretch;

    &.header {
      height: 2.5rem;
    }

    .yAxis,
    .workday {
      border-right: 0.1rem solid #EEE;
    }

    .yAxis {
      width: 8%;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      padding: 0.5rem 0;

      span {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1;
        color: #1E3C72;
        margin: 0;
      }

      div {
        width: 1.35rem;
        height: 0.2rem;
        background: #CCC;
        margin: 0.1rem 0;
      }
    }

    .workday {
      width: 16%;
    }

    .workday,
    .saturday {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      padding: 0 0.5rem;

      h1 {
        margin: 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space; nowrap;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
        color: #1E3C72;
      }
    }

    .saturday {
      width: 12%;
    }
  }
`;

const Toggler = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  color: #FFF;
  background: ${props => props.hasConflicts ?
    'linear-gradient(139.93deg, #FF9A44 0%, #FC6076 100%)' :
    'linear-gradient(131.66deg, #9BE15D 2.87%, #00E3AE 40.04%)'};
  box-shadow: 0px 0.2rem 0.5rem rgba(4, 23, 33, 0.15);
  border-radius: 2rem 2rem 0 2rem;
  padding: 0.5rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  transform: translate3d(0, ${props => props.active ? 0 : 'calc(100% + 2rem)'}, 0);
  transition: 0.25s ease all;
`;

const Content = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  width: 100%;
  height: 100%;
  background: #FAFAFA;
  transform: translate3d(0, ${props => props.active ? 0 : '100%'}, 0);
  transition: 0.25s ease all;

  .wrapper {
    width: 100%;
    height: 100%;
    max-width: calc(1200px + 4rem);
    margin: 0 auto;
    padding: 0 2rem;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 2rem 0 6rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;

    h6 {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #84898C;
      margin: 0 0 1rem;
      width: 100%;
      text-align: left;
    }

    .selectedSchedules {
      flex: 1;
      height: 100%;

      & > div {
        width: calc(100% + 1rem);
        height: calc(100% + 0.5rem);
        padding: 0.5rem 0.5rem 2rem;
        margin: -0.5rem -0.5rem 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;

        & > div {
          &:last-of-type {
            margin: 0;
          }
        }
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        width: 100%;
        margin: 0;
        line-height: 1.5;
        text-align: left;
        color: #1E3C72;
      }

      h1 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 1rem;
      }

      h2 {
        font-size: 0.875rem;
        margin: 0 0 1rem;
      }

      h3 {
        font-size: 0.875rem;
        margin: 0 0 0.25rem;
      }

      h4 {
        font-size: 0.75rem;
      }

      h5 {
        font-size: 0.75rem;
        font-weight: 400;
        color: #84898C;
      }

      .classSchedule {
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        padding: 1rem;
        background: #F3F3F3;
        border-bottom: 0.2rem solid #EEE;

        &:first-of-type {
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        &:last-of-type {
          border-radius: 0 0 0.5rem 0.5rem;
          border-bottom: none;
        }
      }

      button {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        margin: 1rem 0 0;
        font-size: 0.75rem;
        color: #FC6076;

        img {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }

    .timeTable {
      width: 100%;
      max-width: 56rem;
      margin: 0 0 0 2rem;
      height: 100%;
    }
  }

  .statusBar {
    width: 100%;
    height: 4rem;
    position: absolute;
    left: 0;
    bottom: 0;
    bottom: 0;
    background: #FFF;
    box-shadow: 0px 6px 16px rgba(4, 23, 33, 0.15);
    border-radius: 8px 8px 0px 0px;

    .statusBarContent {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: center;

      h1,
      h2,
      button {
        line-height: 1.5;
        margin: 0 1rem 0 0;
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1E3C72;
      }

      h2 {
        flex: 1;
        font-size: 1rem;
        font-weight: 400;
        color: #84898C;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        span {
          color: ${props => props.hasConflicts ? '#FC6076' : '#9BE15D'};
          transition: 0.25s ease all;
        }
      }

      button {
        padding: 0;
        margin: 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        color: #FC6076;
        font-size: 1rem;

        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
`;

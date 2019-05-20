export const StateKey = 'schedule';

const SchedulesActionTypes = {
  load: `${StateKey}_LOAD`,
  loadFinished: `${StateKey}_LOAD_FINISHED`,
};

/**
 * schedules: {
 *  [majorId]: {
 *    semester: string;
 *    courseCount: number;
 *    classCount: number;
 *    courses: {
 *      [courseId]: {
 *        courseName: string;
 *        courseId: string;
 *        courseTerm: string;
 *        courseCredits: string;
 *        courseCurriculum: string;
 *        coursePreRequisite: string;
 *        courseClasses: {
 *          [className]: {
 *            className: string;
 *            classLecturer: string;
 *            classSchedules: [
 *              {
 *                day: 0 - mon, 4 - fri,
 *                startTime: hh:mm,
 *                endTime: hh:mm,
 *                duration: minute,
 *                location: string;
 *              },
 *            ]
 *          }
 *        }
 *      }
 *    }
 *   }
 * }
 */
export const initialState = {
  isLoading: true,
  schedules: {},
};

export function loadSchedules() {
  return ({ type: SchedulesActionTypes.load });
}

export function loadSchedulesFinished(payload) {
  return ({ type: SchedulesActionTypes.loadFinished, payload });
}

export async function fetchSchedules() {
  // replace this later
  await new Promise(resolve => setTimeout(resolve, 1000));

  const ilkomSchedules = {
    semester: 'Semester Ganjil 2019/2020',
    courses: [
      {
        courseName: 'Aljabar Linear',
        courseId: 'CSGE602012',
        courseTerm: 3,
        courseCredits: 3,
        courseCurriculum: 'Kurikulum 06.00.12.01-2016',
        coursePreRequisite: 'Prasyarat: UIST601014 - Matematika Dasar 1',
        courseClasses: [
          {
            className: 'Aljabar Linier — A',
            classLecturer: 'Dr. Dra. Kasiyah M.Sc',
            classSchedules: [
              {
                day: 0,
                startTime: '08:00',
                endTime: '09:40',
                duration: 100,
                location: '2.2304',
              },
              {
                day: 4,
                startTime: '16:00',
                endTime: '16:50',
                duration: 50,
                location: '2.2304',
              },
            ],
          },
          {
            className: 'Aljabar Linier — B',
            classLecturer: 'Dr. Dra. Kasiyah M.Sc',
            classSchedules: [
              {
                day: 0,
                startTime: '16:00',
                endTime: '17:40',
                duration: 100,
                location: '2.2304',
              },
              {
                day: 4,
                startTime: '08:00',
                endTime: '08:50',
                duration: 50,
                location: '2.2304',
              },
            ],
          },
        ],
      },
    ],
  };

  const siSchedules = {
    semester: 'Semester Ganjil 2019/2020',
    courses: [
      {
        courseName: 'Statistika Terapan',
        courseId: 'CSGE602010',
        courseTerm: 5,
        courseCredits: 3,
        courseCurriculum: 'Kurikulum 06.00.12.01-2016',
        coursePreRequisite: 'Prasyarat: UIST601013 - Statistika & Probabilitas',
        courseClasses: [
          {
            className: 'Stater — A',
            classLecturer: 'Dr. Dra. Kasiyah M.Sc',
            classSchedules: [
              {
                day: 0,
                startTime: '08:00',
                endTime: '09:40',
                duration: 100,
                location: '2.2304',
              },
              {
                day: 4,
                startTime: '16:00',
                endTime: '16:50',
                duration: 50,
                location: '2.2304',
              },
            ],
          },
          {
            className: 'Stater — B',
            classLecturer: 'Dr. Dra. Kasiyah M.Sc',
            classSchedules: [
              {
                day: 0,
                startTime: '16:00',
                endTime: '17:40',
                duration: 100,
                location: '2.2304',
              },
              {
                day: 4,
                startTime: '08:00',
                endTime: '08:50',
                duration: 50,
                location: '2.2304',
              },
            ],
          },
        ],
      },
    ],
  };

  const processedIlkomSchedule = {
    semester: ilkomSchedules.semester,
    courseCount: ilkomSchedules.courses.length,
    classCount: countClass(ilkomSchedules.courses),
    courses: arrToObject(ilkomSchedules.courses.map(course => {
      return {
        ...course,
        courseClasses: arrToObject(course.courseClasses, 'className'),
      };
    }), 'courseId'),
  };

  const processedSiSchedule = {
    semester: siSchedules.semester,
    courseCount: siSchedules.courses.length,
    classCount: countClass(siSchedules.courses),
    courses: arrToObject(siSchedules.courses.map(course => {
      return {
        ...course,
        courseClasses: arrToObject(course.courseClasses, 'className'),
      };
    }), 'courseId'),
  };

  return loadSchedulesFinished({ ilkom: processedIlkomSchedule, si: processedSiSchedule });
}

function arrToObject(arr, key) {
  const res = {};

  arr.forEach(item => (res[item[key]] = item));

  return res;
}

function countClass(courses) {
  return courses.reduce((res, cur) => (res + cur.courseClasses.length), 0);
}

export default {
  [SchedulesActionTypes.load]: state => ({
    ...state,
    isLoading: true,
  }),
  [SchedulesActionTypes.loadFinished]: (state, payload) => ({
    ...state,
    isLoading: false,
    schedules: payload,
  }),
}

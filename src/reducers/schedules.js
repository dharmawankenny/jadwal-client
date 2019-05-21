import jadwalApi from '../services/api';
import { arrToObject, countClass } from '../utils/utils';

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
 *        courseSKS: string;
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
  const schedulesResponse = await jadwalApi.get('/jadwal');
  const ilkomSchedules = schedulesResponse.data.find(schedule => schedule.majorId === 'ilkom');
  const siSchedules = schedulesResponse.data.find(schedule => schedule.majorId === 'si');

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

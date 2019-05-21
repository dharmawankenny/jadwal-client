import areRangesOverlapping from 'date-fns/are_ranges_overlapping';

export function arrToObject(arr, key) {
  const res = {};

  arr.forEach(item => (res[item[key]] = item));

  return res;
}

export function countClass(courses) {
  return courses.reduce((res, cur) => (res + cur.courseClasses.length), 0);
}

export function getSelectedClasses(selectedSchedule, courses) {
  return Object.keys(selectedSchedule)
    .filter(courseId => courses[courseId] && courses[courseId].courseClasses[selectedSchedule[courseId]])
    .map(courseId => {
      return {
        courseId,
        courseTerm: courses[courseId].courseTerm,
        courseSKS: courses[courseId].courseSKS,
        ...courses[courseId].courseClasses[selectedSchedule[courseId]],
      };
    });
}

export const dayMap = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function getConflictingSchedules(selectedSchedule, courses) {
  const selectedClasses = getSelectedClasses(selectedSchedule, courses);
  const classTimeMap = {};
  const conflicts = [];

  selectedClasses.forEach(selectedClass => {
    selectedClass.classSchedules.forEach((classSchedule) => {
      const { day, startTime, endTime } = classSchedule;
      const selectedClassScheduleKey = `${day}|${startTime}|${endTime}`;
      const selectedClassScheduleNote = `${selectedClass.className}, ${dayMap[day]} ${startTime} - ${endTime}`;

      Object.keys(classTimeMap).forEach(classTimeKey => {
        const [curDay, curStartTime, curEndTime] = classTimeKey.split('|');

        if (Number(day) === Number(curDay) && isHourIntersectEachOther(startTime, endTime, curStartTime, curEndTime)) {
          conflicts.push(
            `CONFLICT: ${classTimeMap[classTimeKey]} and ${selectedClassScheduleNote}`
          );
        }
      });

      classTimeMap[selectedClassScheduleKey] = selectedClassScheduleNote;
    });
  });

  return conflicts;
}

function isHourIntersectEachOther(from, to, compareFrom, compareTo) {
  const [aHh, aMm] = from.split(':');
  const [bHh, bMm] = to.split(':');
  const [cHh, cMm] = compareFrom.split(':');
  const [dHh, dMm] = compareTo.split(':');

  const mockYearMonthDay = [2019, 0, 1];

  return areRangesOverlapping(
    new Date(...mockYearMonthDay, aHh, aMm),
    new Date(...mockYearMonthDay, bHh, bMm),
    new Date(...mockYearMonthDay, cHh, cMm),
    new Date(...mockYearMonthDay, dHh, dMm),
  );
}

export function countTotalSKS(classes) {
  return classes.reduce((res, cur) => (res + Number(cur.courseSKS)), 0);
}

export function countTotalSchedules(classes) {
  return classes.reduce((res, cur) => (res + cur.classSchedules.length), 0);
}

export function flattenClassSchedules(selectedClasses) {
  const classSchedules = [];

  selectedClasses.forEach(selectedClass => {
    selectedClass.classSchedules.map(classSchedule => {
      classSchedules.push({
        className: selectedClass.className,
        classLecturer: selectedClass.classLecturer,
        ...classSchedule,
      });
    });
  });

  return classSchedules;
}

export function filterCourseByQuery(course, query) {
  if (query.toLowerCase().startsWith('sks: ')) {
    const sksQuery = Number(query.toLowerCase().replace('sks: ', ''));

    if (Number.isNaN(sksQuery)) return true;
    if (Number(course.courseSKS) === sksQuery) return true;

    return false;
  }

  if (query.toLowerCase().startsWith('term: ')) {
    const termQuery = Number(query.toLowerCase().replace('term: ', ''));

    if (Number.isNaN(termQuery)) return true;
    if (Number(course.courseTerm) === termQuery) return true;

    return false;
  }

  return course.courseName.toLowerCase().includes(query.toLowerCase());
}

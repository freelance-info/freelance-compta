export function parseDate(dateString) {
  if (dateString.length < 10) {
    return null;
  }
  try {
    const values = dateString.split('/');
    if (values.length !== 3) {
      return new Date(dateString);
    }
    const result = new Date(`${values[2]}-${values[0]}-${values[1]}`);
    return result;
  } catch (error) {
    return null;
  }
}

export const findMinDate = (dates, minDefault) => dates.reduce((min, cur) => {
  const curDate = new Date(cur);
  return min > curDate ? curDate : min;
}, new Date(minDefault)).toISOString();

export const findMaxDate = (dates, maxDefault) => dates.reduce((max, cur) => {
  const curDate = new Date(cur);
  return max < curDate ? curDate : max;
}, new Date(maxDefault)).toISOString();

export const getQuarter = date => Math.floor(new Date(date).getMonth() / 3) + 1;

export const getQuarters = (minDate, maxDate) => {
  const minYear = new Date(minDate).getFullYear();
  const maxYear = new Date(maxDate).getFullYear();

  const quarters = {};
  for (let currYear = minYear; currYear <= maxYear; currYear += 1) {
    quarters[currYear] = [1, 2, 3, 4];
  }

  const minQuarter = getQuarter(minDate);
  quarters[minYear] = quarters[minYear].filter(quarter => quarter >= minQuarter);

  const maxQuarter = getQuarter(maxDate);
  quarters[maxYear] = quarters[maxYear].filter(quarter => quarter <= maxQuarter);

  return quarters;
};

// quarter format: 'yyyy-q', e.g. '2021-1'
export const getStartDateOfQuarter = quarter => {
  const year = quarter.substring(0, 4);
  const quarterNumber = quarter.substr(5, 1);
  const month = ((quarterNumber - 1) * 3);
  return new Date(year, month, 2);
};

// quarter format: 'yyyy-q', e.g. '2021-1'
export const getEndDateOfQuarter = quarter => {
  const year = quarter.substring(0, 4);
  const quarterNumber = quarter.substr(5, 1);
  const month = ((quarterNumber - 1) * 3) + 3;
  return new Date(year, month, 1);
};

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
  const minYear = new Date(minDate).getYear();
  const maxYear = new Date(maxDate).getYear();

  const years = {};
  for (let currYear = minYear; currYear <= maxYear; currYear += 1) {
    years[currYear] = [1, 2, 3, 4];
  }

  const minQuarter = getQuarter(minDate);
  years[minYear] = years[minYear].filter(quarter => quarter >= minQuarter);

  const maxQuarter = getQuarter(maxDate);
  years[maxYear] = years[maxYear].filter(quarter => quarter <= maxQuarter);
  
};

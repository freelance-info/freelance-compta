import React from 'react';
import { getQuarters } from './date';

test('Get quarters different years', () => {
  const quarters = getQuarters('2000-01-04', '2002-02-01');
  expect(quarters).toBe({
    2000: [2, 3, 4],
    2001: [1, 2, 3, 4],
    2002: [1]
  });
});

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { getQuarters, getStartDateOfQuarter, getEndDateOfQuarter } from './date';

test('Get quarters different years', () => {
  const quarters = getQuarters('2000-04-04', '2002-02-01');
  expect(quarters).toStrictEqual({
    2000: [2, 3, 4],
    2001: [1, 2, 3, 4],
    2002: [1],
  });
});

test('Get several quarters same year', () => {
  const quarters = getQuarters('2000-01-04', '2000-06-01');
  expect(quarters).toStrictEqual({ 2000: [1, 2] });
});

test('Get 1 single quarter', () => {
  const quarters = getQuarters('2000-01-04', '2000-06-01');
  expect(quarters).toStrictEqual({ 2000: [1, 2] });
});

test('Get start date of first quarter', () => {
  const date = getStartDateOfQuarter('2000-1');
  expect(date.toISOString().substring(0, 10)).toBe('2000-01-01');
});

test('Get start date of last quarter', () => {
  const date = getStartDateOfQuarter('2000-4');
  expect(date.toISOString().substring(0, 10)).toBe('2000-10-01');
});

test('Get end date of first quarter', () => {
  const date = getEndDateOfQuarter('2000-1');
  expect(date.toISOString().substring(0, 10)).toBe('2000-03-31');
});

test('Get end date of last quarter', () => {
  const date = getEndDateOfQuarter('2000-4');
  expect(date.toISOString().substring(0, 10)).toBe('2000-12-31');
});

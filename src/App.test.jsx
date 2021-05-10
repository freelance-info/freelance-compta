import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Paramètres généraux', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Paramètres généraux/i);
  expect(linkElement).toBeInTheDocument();
});

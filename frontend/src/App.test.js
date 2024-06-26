import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

test('renders login form', async () => {
  await act(async () => {
    render(<App />);
  });
  const loginElement = screen.getByPlaceholderText(/Username/i);
  expect(loginElement).toBeInTheDocument();
});

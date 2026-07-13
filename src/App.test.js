import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form with email, password, and action button', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
});

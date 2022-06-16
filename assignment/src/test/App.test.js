import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders app conponent', () => {
  render(<App />);
  const headingElement = screen.getByText(/Manager Search Componenet/i);
  expect(headingElement).toBeInTheDocument();
});

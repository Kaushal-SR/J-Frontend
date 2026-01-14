import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  test('renders correctly', () => {
    render(<Header />);
    const headerElement = screen.getByText(/header/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('responds to props as expected', () => {
    const title = 'Test Header';
    render(<Header title={title} />);
    const titleElement = screen.getByText(title);
    expect(titleElement).toBeInTheDocument();
  });
});
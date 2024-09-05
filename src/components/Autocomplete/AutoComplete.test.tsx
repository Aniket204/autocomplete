import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AutoComplete from './AutoComplete';
import useDebounce from '../../customHooks/useDebounce';
import useFetch from '../../customHooks/useFetch';

jest.mock('../../customHooks/useDebounce', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../customHooks/useFetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseDebounce = useDebounce as jest.MockedFunction<typeof useDebounce>;
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;

describe('AutoComplete Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders input field and handles input change', async () => {
    mockUseDebounce.mockReturnValue('bulldog');
    mockUseFetch.mockReturnValue({ data: [{ name: 'bulldog' }], loading: false, error: null });
    render(<AutoComplete />);
    const input = screen.getByPlaceholderText('Search for dog breeds...');
    fireEvent.change(input, { target: { value: 'bulldog' } });
    await waitFor(() => {
      expect(input).toHaveValue('bulldog');
    });
  });


  test('debounced query is called after typing', async () => {
    mockUseDebounce.mockReturnValue('bulldog');
    mockUseFetch.mockReturnValue({ data: [], loading: false, error: null });

    render(<AutoComplete />);

    const input = screen.getByPlaceholderText('Search for dog breeds...');
    fireEvent.change(input, { target: { value: 'bulldog' } });

    await waitFor(() => {
      expect(mockUseFetch).toHaveBeenCalledWith('https://api.thedogapi.com/v1/breeds/search?q=bulldog');
    });
  });


  test('finds correct suggestions and checks if the query is bolded', async () => {
    mockUseDebounce.mockReturnValue('b');
    mockUseFetch.mockReturnValue({ data: [{ name: 'Bulldog' }, { name: 'Beagle' }], loading: false, error: null });

    render(<AutoComplete />);

    const input = screen.getByPlaceholderText('Search for dog breeds...');
    fireEvent.change(input, { target: { value: 'b' } });

    await waitFor(() => {
      const suggestions = screen.getByRole('list');

      // Match "Bulldog" by checking that both the "B" (in bold) and the rest of the word "ulldog" are found together
      const firstSuggestion = within(suggestions).getByText((content, element) => {
        return content.includes('ulldog') && element?.querySelector('b')?.textContent === 'B';
      });

      const secondSuggestion = within(suggestions).getByText((content, element) => {
        return content.includes('eagle') && element?.querySelector('b')?.textContent === 'B';
      });

      expect(firstSuggestion).toBeInTheDocument();
      expect(secondSuggestion).toBeInTheDocument();
    });

    const firstSuggestion = screen.getByText((content, element) => {
      return content.includes('ulldog') && element?.querySelector('b')?.textContent === 'B';
    });

    expect(within(firstSuggestion).getByText('B')).toBeInTheDocument();
  });


  test('handles arrow key navigation and selection', async () => {
    mockUseDebounce.mockReturnValue('b');
    mockUseFetch.mockReturnValue({ data: [{ name: 'Bulldog' }, { name: 'Beagle' }], loading: false, error: null });

    render(<AutoComplete />);

    const input = screen.getByPlaceholderText('Search for dog breeds...');
    fireEvent.change(input, { target: { value: 'b' } });

    await waitFor(() => {
      const suggestions = screen.getByRole('list');

      const firstSuggestion = within(suggestions).getByText((content, element) => {
        return content.includes('ulldog') && element?.querySelector('b')?.textContent === 'B';
      });

      const secondSuggestion = within(suggestions).getByText((content, element) => {
        return content.includes('eagle') && element?.querySelector('b')?.textContent === 'B';
      });

      expect(firstSuggestion).toBeInTheDocument();
      expect(secondSuggestion).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveValue('Bulldog');
  });


  test('renders loading and error states correctly', () => {
    mockUseDebounce.mockReturnValue('');
    mockUseFetch.mockReturnValue({ data: [], loading: true, error: null });

    render(<AutoComplete />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    mockUseFetch.mockReturnValue({ data: [], loading: false, error: 'Failed to fetch' });

    render(<AutoComplete />);

    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  
  test('renders no results found message', async () => {
    mockUseDebounce.mockReturnValue('xyz');
    mockUseFetch.mockReturnValue({ data: [], loading: false, error: null });

    render(<AutoComplete />);

    await waitFor(() => {
      expect(screen.getByText('No results found for "xyz"')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();  
  });
});

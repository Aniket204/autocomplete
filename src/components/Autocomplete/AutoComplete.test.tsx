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

    const suggestions = screen.getByRole('list');

    const suggestionElement1 = within(suggestions).getByText((content) =>
      content.includes('ulldog')
    );
    const boldElement1 = within(suggestionElement1).getByText('B', { selector: 'b' });
    expect(boldElement1).toBeInTheDocument();


    const suggestionElement2 = within(suggestions).getByText((content) =>
      content.includes('eagle')
    );
    const boldElement2 = within(suggestionElement2).getByText('B', { selector: 'b' });
    expect(boldElement2).toBeInTheDocument();
  });


  test('handles arrow key navigation and selection', () => {
    mockUseDebounce.mockReturnValue('b');
    mockUseFetch.mockReturnValue({ data: [{ name: 'Bulldog' }, { name: 'Beagle' }], loading: false, error: null });

    render(<AutoComplete />);

    const input = screen.getByPlaceholderText('Search for dog breeds...');
    fireEvent.change(input, { target: { value: 'b' } });

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

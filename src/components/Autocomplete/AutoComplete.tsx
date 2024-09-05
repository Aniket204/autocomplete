import React, { useState, useCallback } from 'react';
import './Styles.css';
import useDebounce from '../../customHooks/useDebounce';
import useFetch from '../../customHooks/useFetch';

interface Breed {
  name: string;
}

const AutoComplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);

  const { data: filteredSuggestions, loading, error } = useFetch<Breed>(`https://api.thedogapi.com/v1/breeds/search?q=${debouncedQuery}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        setQuery(filteredSuggestions[highlightedIndex].name); 
        setHighlightedIndex(-1); 
      }
    }
  };

  const highlightSuggestion = useCallback((suggestion: string, query: string) => {
    const parts = suggestion.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? <b key={i}>{part}</b> : part
        )}
      </span>
    );
  }, []);

  const ListItem: React.FC<{ suggestion: Breed; index: number }> = React.memo(({ suggestion, index }) => (
    <li
      style={{
        backgroundColor: index === highlightedIndex ? '#ddd' : '#fff',
        padding: '8px',
        cursor: 'pointer'
      }}
    >
      {highlightSuggestion(suggestion.name, query)}
    </li>
  ));

  return (
    <div className='auto-complete'>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for dog breeds..."
        data-testid="input-box"
      />

      <div className='suggestions'>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && filteredSuggestions.length === 0 && debouncedQuery && (
          <p>No results found for "{debouncedQuery}"</p>
        )}
        {!loading && !error && filteredSuggestions.length > 0 && (
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                suggestion={suggestion}
                index={index}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoComplete;

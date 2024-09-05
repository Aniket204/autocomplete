import { useState, useEffect } from 'react';

const cache: { [key: string]: any } = {};

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (cache[url]) {
        setData(cache[url]);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result: T[] = await response.json();
          cache[url] = result; 
          setData(result);
          setError(null);
        } catch (error: any) {
          setError(error.message);
          setData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;

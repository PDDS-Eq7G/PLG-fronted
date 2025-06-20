import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config'

interface ConfigContextType {
  config: Record<string, string>;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextType>({
  config: {},
  loading: true,
  error: null,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${API_URL}/config-general`);
        setConfig(response.data.parametrosConfiguracion || {});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

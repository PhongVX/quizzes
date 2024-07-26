import { useLocation } from 'react-router-dom';

export const useUrlSearchParams = () => {
    const { search } = useLocation();

    const buildQueryParams = (data: Record<string, string>) => {
        const query = new URLSearchParams(data).toString();
        return query; 
    }

    const getDataFromQueryString = (key: string) => {
        const queryStringValue = new URLSearchParams(search).get(key);
        return queryStringValue;
    }
    
    return {
        buildQueryParams,
        getDataFromQueryString
    }
}
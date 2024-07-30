
export const useDataFromBrowserStorage = () => {
    const getDataFromStorage = (key: string, defaultValue: string = '{}') => {
        let data =  JSON.parse(localStorage.getItem(key) || defaultValue)
        return data;
    }

    const clearStorage = () => {
        localStorage.clear();
    }

    return {
        getDataFromStorage,
        clearStorage
    }
}
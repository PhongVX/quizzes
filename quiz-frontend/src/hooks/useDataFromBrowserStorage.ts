
export const useDataFromBrowserStorage = () => {
    const getDataFromStorage = (key: string, defaultValue: string = '{}') => {
        let data =  JSON.parse(localStorage.getItem(key) || defaultValue)
        return data;
    }
    return {
        getDataFromStorage
    }
}
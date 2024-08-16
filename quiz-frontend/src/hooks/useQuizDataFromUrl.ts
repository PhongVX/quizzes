import { useUrlSearchParams } from './useUrlSearchParams';

export const useQuizDataFromUrl = () => {
    const { getDataFromQueryString } = useUrlSearchParams();

    const getQuizInfoFromUrl = () => {
        const username = getDataFromQueryString('username');
        const quizId = getDataFromQueryString('quizId');
        return { username, quizId };
    }

    return {
        getQuizInfoFromUrl
    }
}
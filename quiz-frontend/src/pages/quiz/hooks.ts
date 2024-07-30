import { useState } from 'react';


export const useQuiz = () => {
    const [ submissionData, setSubmissionData ] = useState<any>();

    return {
        submissionData,
        setSubmissionData,
    }
}
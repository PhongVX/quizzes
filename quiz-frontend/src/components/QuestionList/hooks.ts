import React from 'react';

export const useQuizTimer = (dueDate: string, handleSubmitQuiz: () => void) => {
    const calculateInitialTime = () => {
        const due = new Date(dueDate).getTime();
        const timeNow = new Date().getTime();
        return Math.floor((due - timeNow) / 1000);
    };
    const [time, setTime] = React.useState(calculateInitialTime);

    React.useEffect(() => {
        let timer = setInterval(() => {
          setTime((time) => {
            if (time <= 0) {
              handleSubmitQuiz();
              clearInterval(timer);
              return 0;
            } else return time - 1;
          });
        }, 1000);
    }, []);

    const getTimeLeftText = () => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    return {
        getTimeLeftText
    }
}
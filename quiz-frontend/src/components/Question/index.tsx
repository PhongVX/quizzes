import React, { useState } from 'react'
import { Radio, RadioChangeEvent } from 'antd';

import './styles.scss';
import { useDataFromBrowserStorage } from '../../hooks/useDataFromBrowserStorage';
import { LocalStorageKey } from '../../const';

export const Question = ({ position, questionData }: any) => {
    const [ currentAnswer, setCurrentAnswer ] = useState();
    const { getDataFromStorage } = useDataFromBrowserStorage();
    
    const handleAnswerQuestion = (e: RadioChangeEvent) => {
        setCurrentAnswer(e.target.value);
        let userAnswer =  getDataFromStorage(LocalStorageKey.UserAnswer);
        userAnswer[questionData.id] = e.target.value;
        localStorage.setItem(LocalStorageKey.UserAnswer, JSON.stringify(userAnswer))        
    }

    const getAnswerFromLocalStorage = () => {
        let userAnswer =  getDataFromStorage(LocalStorageKey.UserAnswer);
        return userAnswer[questionData.id];
    }

    React.useEffect(() => {
        let answer = getAnswerFromLocalStorage();
        if (answer) {
            setCurrentAnswer(answer);
            return
        }
        setCurrentAnswer(undefined);
    }, [questionData.id]);

    return (
        <div className='question-wrapper'>
            <h2>{position}. {questionData.question}</h2>
            <Radio.Group  value={currentAnswer} name="radiogroup" onChange={handleAnswerQuestion}>
                {
                    questionData.listAnswer.map((answer: string, index: number) => {
                        return (
                            <>
                                <Radio key={index} value={answer}>{answer}</Radio> <br />
                            </>
                        )
                    })
                }
            </Radio.Group>
        </div>
    )
}

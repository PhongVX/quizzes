import React, { useState } from 'react';
import { Flex, Progress, Col, Row  } from 'antd';
import { useLocation } from 'react-router-dom';

import { QuestionList } from '../../components/QuestionList';

import './styles.scss';
import { useSocket } from '../../context/socket/hooks';
import { LocalStorageKey, SocketEvents } from '../../const';
import { useUrlSearchParams } from '../../hooks/useUrlSearchParams';
  
export const Quiz = () => {
    const [ submissionData, setSubmissionData ] = useState<any>();
    const [ isFinish, setIsFinish ] = useState(false);
    const { socket } = useSocket();
    const location = useLocation();
    const { getDataFromQueryString } = useUrlSearchParams();
    const username = getDataFromQueryString('username');
    const quizId = getDataFromQueryString('quizId');
    
    React.useEffect(() => {
        socket?.on(SocketEvents.SubmitQuizConfirmed, (msg) => {
            setIsFinish(true);
            setSubmissionData(msg);
        });
    }, [socket]);

    React.useEffect(() => {
        if (!location.state?.listQuestion) {
            socket?.emit(SocketEvents.ContinueQuiz, { username, quizId });
        }
    }, [location.state, socket]);

    const renderQuestionList = () => {
        const listQuestionFromStorage = JSON.parse(localStorage.getItem(`${LocalStorageKey.ListQuestion}_${username}_${quizId}`) || '[]');
        const listQuestion = location.state?.listQuestion || listQuestionFromStorage;
        return (
            <div className='quiz-container'>
                <QuestionList listQuestion={listQuestion} />
            </div>
        )
    }

    const renderResultSumary= () => {
        return (
            <div className='sumary-result-container'>
                <br/>
                <h1>Total score</h1>
                <hr />
                <br/>
                <div className='sumary-chart'>
                    <Progress type="circle" percent={submissionData?.score} />
                    <br />
                    Number of correct answers: {submissionData.numberOfCorrectAnswers} <br />
                    Number of questions: {submissionData.numberOfQuestions} <br />
                </div>
            </div>
        )
    }
    return (
        <div className='quiz-page'>
            {
                <>
                    Leader board <br/>
                </>
            }
            {
                isFinish ? renderResultSumary() : renderQuestionList()
            }
        </div>
    )
}

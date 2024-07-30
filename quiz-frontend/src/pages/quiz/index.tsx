import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { QuestionList } from '../../components/QuestionList';
import { useSocket } from '../../context/socket/hooks';
import { SocketEvents, Path } from '../../const';
import { useQuiz } from './hooks';
import { useDataFromBrowserStorage } from '../../hooks/useDataFromBrowserStorage';
import { ResultSumary } from '../../components/ResultSumary';
import { LeaderBoard } from '../../components/LeaderBoard';

import './styles.scss';

export const Quiz = () => {
    const { 
        submissionData, 
        setSubmissionData
    } = useQuiz();

    const { socket } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const { clearStorage  } = useDataFromBrowserStorage();

    React.useEffect(() => {
        if (!location.state) {
            navigate(`${Path.Main}`);
        }
        setSubmissionData(location.state)
    }, [location.state]);

    React.useEffect(() => {
        socket?.on(SocketEvents.SubmitQuizConfirmed, (msg) => {
            setSubmissionData(msg);
            clearStorage();
        });
    }, [socket]);

    const renderQuestionList = () => {
        if (submissionData?.listQuestion.length > 0) {
            return (
                <div className='quiz-container'>
                    <QuestionList 
                        startTime={submissionData?.startTime} 
                        dueDate={submissionData?.dueDate} 
                        listQuestion={submissionData?.listQuestion} 
                    />
                </div>
            )
        }
        return null;
    }

    const QuizContainer = useMemo(() => {
        if (submissionData?.submissionTime) {
            return (
                <ResultSumary 
                    score={submissionData?.score}
                    numberOfCorrectAnswers={submissionData?.numberOfCorrectAnswers}
                    numberOfQuestions={submissionData?.numberOfQuestions}
                />
            )
        }
        return renderQuestionList();
    }, [submissionData]); 

    return (
        <div className='quiz-page'>
            <LeaderBoard />
            {
                QuizContainer
            }
        </div>
    )
}

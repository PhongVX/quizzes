import React, { useState } from 'react'
import { Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

import { Question } from '../Question'

import './styles.scss';
import { useDataFromBrowserStorage } from '../../hooks/useDataFromBrowserStorage';
import { LocalStorageKey, SocketEvents } from '../../const';
import { useUrlSearchParams } from '../../hooks/useUrlSearchParams';
import { useSocket } from '../../context/socket/hooks';

type QuestionListProps = {
  listQuestion: any[]
}

export const QuestionList = ({ listQuestion }: QuestionListProps) => {
  const [ currentQuestion, setCurrentQuestion ] = useState(0);
  const canGoNext = currentQuestion < listQuestion.length - 1;
  const canBackToPrevious = currentQuestion > 0;
  const { getDataFromQueryString } = useUrlSearchParams();
  const { getDataFromStorage } = useDataFromBrowserStorage();
  const { socket } = useSocket();

  const goNextQuestion = () => {
    if (currentQuestion < listQuestion.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  const backToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  const handleSubmitQuiz = () => {
    let userAnswer = getDataFromStorage(LocalStorageKey.UserAnswer);
    const username = getDataFromQueryString('username');
    const quizId = getDataFromQueryString('quizId');
    socket?.emit(SocketEvents.SubmitQuiz, {
      username,
      quizId,
      listAnswer: userAnswer
    });
  }

  return (
    <div className='question-list-wrapper'>
        <Button id='submit-quiz-button' onClick={handleSubmitQuiz}>Submit</Button>
        <br/>
        <h1>Simple quiz</h1>
        <hr />
        <div className='question-container'>
          <Question position={currentQuestion + 1} questionData={listQuestion[currentQuestion]} />
        </div>
        
        <br />
        <div className='question-list-footer'>
            <Button disabled={!canBackToPrevious} onClick={backToPreviousQuestion} icon={<LeftOutlined />}/>
            &nbsp;
            <Button disabled={!canGoNext} onClick={goNextQuestion} icon={<RightOutlined />}/>
        </div>
    </div>
  )
}

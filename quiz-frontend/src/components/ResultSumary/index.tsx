import React from 'react'
import { Progress } from 'antd';

import './styles.scss';

type ResultSumaryProps = {
    score: number,
    numberOfCorrectAnswers: number,
    numberOfQuestions: number
}

export const ResultSumary = ({score, numberOfCorrectAnswers, numberOfQuestions}: ResultSumaryProps) => {
  return (
    <div className='sumary-result-container'>
        <br/>
        <h2>Total score</h2>
        <hr />
        <br/>
        <div className='sumary-chart'>
            <Progress type="circle" percent={score} />
            <br />
            Number of correct answers: {numberOfCorrectAnswers} <br />
            Number of questions: {numberOfQuestions} <br />
        </div>
    </div>
  )
}

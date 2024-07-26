import React from 'react'
import { QuestionList } from '../../components/QuestionList';

import './styles.scss';

const listQuestion = [
    {
        id: 1,
        question: 'What is the "Hello"?',
        type: 'SingleChoice', 
        listAnswer: ['Xin chào', 'Tạm biệt', 'Ngôi nhà', 'Tủ lạnh']
    },
    {
        id: 2,
        question: 'What is the "Thank you"?',
        type: 'SingleChoice', 
        listAnswer: ['Làm ơn', 'Cám ơn', 'Con thuyền', 'Tạm biệt']
    }
];

export const Quiz = () => {
    return (
        <div className='quiz-page'>
            <div className='quiz-container'>
                <QuestionList listQuestion={listQuestion} />
            </div>
            {/* <div className='leaderboard-container'>
                Leader Board
            </div> */}
        </div>
    )
}

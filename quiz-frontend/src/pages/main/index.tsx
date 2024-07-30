import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    FormProps,
    Input,
    Button,
    Form,
    Alert
} from 'antd';

import { LocalStorageKey, Path, SocketEvents } from '../../const';
import { useUrlSearchParams } from '../../hooks/useUrlSearchParams';
import { useSocket } from '../../context/socket/hooks';

import './styles.scss';


type FieldType = {
    username?: string;
    quizId?: string;
};

export const Main = () => {
    const [ errorMessage, setErrorMessage ] = useState('');
    const navigate = useNavigate();
    const { buildQueryParams } = useUrlSearchParams();
    const { socket } = useSocket();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        socket?.emit(SocketEvents.StartQuiz, values);
        socket?.on(SocketEvents.StartQuizConfirmed, (msg) => {
            if (msg.error) {
                setErrorMessage('Something went wrong, Please try again.');
                return
            }
            const query = buildQueryParams({quizId: msg.quizId, username: msg.username});
            localStorage.setItem(`${LocalStorageKey.ListQuestion}_${msg.username}_${msg.quizId}`, JSON.stringify(msg.listQuestion));    
            navigate(`${Path.Quiz}?${query}`, { state: { ...msg }});
            
        });
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='main-page'>
            <div className='start-quiz-form'>
                { errorMessage && <Alert onClose={() => { setErrorMessage('')}} id='notification' closeIcon={true} message={errorMessage} type='error' /> }
                <h1>Your Quiz</h1>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item<FieldType>
                        name='username'
                        rules={[{ required: true, message: 'Please input username!' }]}
                    >
                        <Input placeholder='User Name' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name='quizId'
                        rules={[{ required: true, message: 'Please input quizId!' }]}
                    >
                        <Input placeholder='Quiz ID' />
                    </Form.Item>
                    <Form.Item>
                        <Button id='submit-button' type='primary' htmlType='submit'>Join</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

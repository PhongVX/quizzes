import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
    FormProps,
    Input,
    Button,
    Form,
    Alert
} from 'antd';

import './styles.scss';

import { LocalStorageKey, Path, SocketEvents } from '../../const';
import { useUrlSearchParams } from '../../hooks/useUrlSearchParams';
import { useSocket } from '../../context/socket/hooks';

type FieldType = {
    username?: string;
    quizId?: string;
};

export const Main = () => {
    const navigate = useNavigate();
    const { buildQueryParams } = useUrlSearchParams();
    const { socket } = useSocket();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        socket?.emit(SocketEvents.StartQuiz, values);
        socket?.on(SocketEvents.StartQuizConfirmed, (msg) => {
            const query = buildQueryParams({quizId: msg.quizId, username: msg.username});
            localStorage.setItem(`${LocalStorageKey.ListQuestion}_${msg.username}_${msg.quizId}`, JSON.stringify(msg.listQuestion));    
            navigate(`${Path.Quiz}?${query}`, { state: { listQuestion: msg.listQuestion}});
            
        });
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='main-page'>
            <div className='start-quiz-form'>
                <Alert id='notification' message='Success Text' type='success' />
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
                        <Button id='submit-button' type='primary' htmlType='submit'>Start Quiz</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

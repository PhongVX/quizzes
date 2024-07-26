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

import { Path } from '../../const';
import { useUrlSearchParams } from '../../hooks/useUrlSearchParams';

type FieldType = {
    userId?: string;
    quizId?: string;
};

export const Main = () => {
    const navigate = useNavigate();
    const { buildQueryParams } = useUrlSearchParams();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const query = buildQueryParams(values);
        navigate(`${Path.Quiz}?${query}`);
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
                        name='userId'
                        rules={[{ required: true, message: 'Please input userId!' }]}
                    >
                        <Input placeholder='User ID' />
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

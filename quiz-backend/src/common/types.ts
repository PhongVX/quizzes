
export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH'
}

export enum SocketEvents {
    StartQuiz = 'start-quiz',
    StartQuizConfirmed = 'start-quiz-confirmed',
    ContinueQuiz = 'continue-quiz',
    SubmitQuiz = 'submit-quiz',
    SubmitQuizConfirmed = 'submit-quiz-confirmed',
    DisConnect = 'disconnect'
}

export enum QueueEvents {
    StartQuiz = 'start-quiz',
    SubmitQuiz = 'submit-quiz'
}
export enum Path {
    Main = '/',
    Quiz = 'quiz'
}

export enum LocalStorageKey {
    UserAnswer = 'userAnswers',
    ListQuestion = 'listQuestion'
}

export enum SocketEvents {
    StartQuiz = 'start-quiz',
    StartQuizConfirmed = 'start-quiz-confirmed',
    ContinueQuiz = 'continue-quiz',
    ContinueQuizConfirmed = 'continue-quiz-confirmed',
    SubmitQuiz = 'submit-quiz',
    SubmitQuizConfirmed = 'submit-quiz-confirmed'
}
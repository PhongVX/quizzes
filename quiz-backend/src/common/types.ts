
export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH'
}

export enum SocketEvents {
    GetLatestLeaderBoard = 'get-latest-leader-board',
    LeaderBoardUpdated = 'leader-board-updated',
    StartQuiz = 'start-quiz',
    StartQuizConfirmed = 'start-quiz-confirmed',
    SubmitQuiz = 'submit-quiz',
    SubmitQuizConfirmed = 'submit-quiz-confirmed',
    DisConnect = 'disconnect'
}

export enum QueueEvents {
    StartQuiz = 'start-quiz',
    SubmitQuiz = 'submit-quiz',
    GetLatestLeaderBoard = 'get-latest-leader-board',
}
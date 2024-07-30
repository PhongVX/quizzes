
import { SocketEvents } from "../common/types";
import { IWebSocket } from "../core/socket/types";
import { IQuizRepository, QuizError, StartQuizParams, QuizParams } from "./types";


export interface IQuizService {
    startQuiz: (data: StartQuizParams) => Promise<any>,
    startQuizConfirmed: (socket: IWebSocket | undefined, data: StartQuizParams, error?: QuizError) => Promise<void>
    submitQuiz: (data: QuizParams) => Promise<boolean>
    submitQuizConfirmed: (socket: IWebSocket | undefined, data: QuizParams) => Promise<void>
    updateLeaderBoardToClient: (socket: IWebSocket | undefined, data: QuizParams) => Promise<void>
}

export class QuizService implements IQuizService { 
    private quizRepository: IQuizRepository;
    constructor(quizRepository: IQuizRepository) {
        this.quizRepository = quizRepository;
    }

    calculateScore = async(data: QuizParams) => {
        const questionList = await this.quizRepository.findListQuestionByQuizId(data.quizId);
        let countCorrectAnswer = 0;
        questionList.forEach((question: any) => {
            if (question.correctAnswer === data.listAnswer?.[question.id]) {
                countCorrectAnswer++;
            }
        });
        return {
            score: countCorrectAnswer / questionList.length  * 100,
            numberOfCorrectAnswers: countCorrectAnswer,
            numberOfQuestions: questionList.length
        }
    }
    
    startQuiz = async(startQuizServiceParams: StartQuizParams) => {
        const quizSubmissionResult = await this.quizRepository.findQuizSubmissionByUsernameAndQuizId(startQuizServiceParams);
        if (!quizSubmissionResult) {
            return await this.quizRepository.startQuiz(startQuizServiceParams)
        }
        return quizSubmissionResult;
    }

    startQuizConfirmed = async(socket: IWebSocket | undefined, data: QuizParams, error?: QuizError) => {
        if (error) {
            socket?.emitMessageToRoom(`${data.quizId}_${data.username}`, SocketEvents.StartQuizConfirmed, error);
            return 
        }
        const questionList = await this.quizRepository.findListQuestionByQuizId(data.quizId);
        const questionListWithoutCorrectAnswer = questionList?.map(({correct_answer, ...restQuestion}: any) => restQuestion)
        socket?.emitMessageToRoom(`${data.quizId}_${data.username}`, SocketEvents.StartQuizConfirmed, {
            username: data.username,
            quizId: data.quizId,
            score: data.score,
            dueDate: data.dueDate,
            startTime: data.startTime,
            submissionTime: data.submissionTime,
            numberOfCorrectAnswers: data.numberOfCorrectAnswers,
            numberOfQuestions: data.numberOfQuestions,
            listQuestion: questionListWithoutCorrectAnswer
        });
    }

    submitQuiz = async(data: QuizParams) => {
        const scoreData = await this.calculateScore(data);
        return await this.quizRepository.submitQuiz({...data, ...scoreData});
    }

    submitQuizConfirmed = async(socket: IWebSocket | undefined, data: QuizParams) => {
        const quizSubmissionResult = await this.quizRepository.findQuizSubmissionByUsernameAndQuizId(data);
        socket?.emitMessageToRoom(`${data.quizId}_${data.username}`, SocketEvents.SubmitQuizConfirmed, quizSubmissionResult);
    }

    updateLeaderBoardToClient = async(socket: IWebSocket | undefined, data: QuizParams) => {
        const listLeaderBoard = await this.quizRepository.findQuizSubmissionOrderByScore(data);
        socket?.emitMessageToRoom(`${data.quizId}`, SocketEvents.LeaderBoardUpdated, listLeaderBoard);
    }
}
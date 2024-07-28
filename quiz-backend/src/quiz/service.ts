
import { SocketEvents } from "../common/types";
import { IWebSocket } from "../core/socket/types";
import { IQuizRepository, StartQuizParams, SubmitQuizParams } from "./types";


export interface IQuizService {
    startQuiz: (data: StartQuizParams) => Promise<boolean>,
    startQuizConfirmed: (socket: IWebSocket | undefined, data: StartQuizParams) => Promise<void>
    submitQuiz: (data: SubmitQuizParams) => Promise<boolean>
    submitQuizConfirmed: (socket: IWebSocket | undefined, data: SubmitQuizParams) => Promise<void>
}

export class QuizService implements IQuizService { 
    private quizRepository: IQuizRepository;
    constructor(quizRepository: IQuizRepository) {
        this.quizRepository = quizRepository;
    }

    startQuiz = async(startQuizServiceParams: StartQuizParams) => {
        return this.quizRepository.startQuiz(startQuizServiceParams)
    }

    startQuizConfirmed = async(socket: IWebSocket | undefined, data: StartQuizParams) => {
        const questionList = await this.quizRepository.findListQuestionByQuizId(data.quizId);
        const questionListWithoutCorrectAnswer = questionList.map(({correct_answer, ...restQuestion}: any) => restQuestion)
        socket?.emitMessageToRoom(`${data.quizId}_${data.username}`, SocketEvents.StartQuizConfirmed, {
            username: data.username,
            quizId: data.quizId,
            listQuestion: questionListWithoutCorrectAnswer
        });
    }

    calculateScore = async(data: SubmitQuizParams) => {
        const questionList = await this.quizRepository.findListQuestionByQuizId(data.quizId);
        let countCorrectAnswer = 0;
        questionList.forEach((question: any) => {
            if (question.correctAnswer === data.listAnswer[question.id]) {
                countCorrectAnswer++;
            }
        });
        return {
            score: countCorrectAnswer / questionList.length  * 100,
            numberOfCorrectAnswers: countCorrectAnswer,
            numberOfQuestions: questionList.length
        }
    }

    submitQuiz = async(data: SubmitQuizParams) => {
        const scoreData = await this.calculateScore(data);
        return await this.quizRepository.submitQuiz({...data, ...scoreData});
    }

    submitQuizConfirmed = async(socket: IWebSocket | undefined, data: SubmitQuizParams) => {
        const quizSubmissionResult = await this.quizRepository.findQuizSubmissionByUsernameAndQuizId(data);
        socket?.emitMessageToRoom(`${data.quizId}_${data.username}`, SocketEvents.SubmitQuizConfirmed, quizSubmissionResult?.[0]);
    }
}
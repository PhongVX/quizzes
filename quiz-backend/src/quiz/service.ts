
import { IQuizRepository, StartQuizParams } from "./types";


export interface IQuizService {
    startQuiz: (data: StartQuizParams) => Promise<boolean>,
}

export class QuizService implements IQuizService { 
    private quizRepository: IQuizRepository;
    constructor(quizRepository: IQuizRepository) {
        this.quizRepository = quizRepository;
    }

    startQuiz = async(startQuizServiceParams: StartQuizParams) => {
        return this.quizRepository.startQuiz(startQuizServiceParams)
    }
}
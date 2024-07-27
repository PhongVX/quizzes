import { IDatabase } from "../common/database/types";
import { buildInsertQuery } from "../common/database/utils";
import { addMinutesInTheCurrentDate, getDateTimeWithFormat } from "../utils/date";
import { IQuizRepository, StartQuizDBObject, StartQuizParams } from "./types";

export class QuizRepository implements IQuizRepository { 
    private db: IDatabase;
    private quizSubmissionsTable: string = 'quiz_submissions';
    constructor(db: IDatabase) {
        this.db = db;
    }

    startQuiz = async({username, quizId}: StartQuizParams) => {
        const startTimeFormatted = getDateTimeWithFormat();
        const endTime = addMinutesInTheCurrentDate(15);
        const endTimeFormatted = getDateTimeWithFormat(endTime);
        const startQuizDBObject: StartQuizDBObject = {
            quiz_id: quizId,
            username,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted
        };
        const { queryString, values } = buildInsertQuery(startQuizDBObject, { table: this.quizSubmissionsTable })
        try {
            const result = await this.db.query(queryString, values);
            if (!result || result.rowCount === 0) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}
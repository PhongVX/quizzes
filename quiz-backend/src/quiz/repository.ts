import { uuid } from 'uuidv4';
import { IDatabase } from "../common/database/types";
import { buildInsertQuery, buildUpdateQuery } from "../common/database/utils";
import { convertKeysToCamelCase } from "../utils/converter";
import { addMinutesInTheCurrentDate, getDateTimeWithFormat } from "../utils/date";
import { IQuizRepository, StartQuizDBObject, StartQuizParams, SubmitQuizParams } from "./types";

export class QuizRepository implements IQuizRepository { 
    private db: IDatabase;
    private quizSubmissionsTable: string = 'quiz_submissions';
    constructor(db: IDatabase) {
        this.db = db;
    }

    findListQuestionByQuizId = async(quizId: string) => {
        const queryString = `SELECT * FROM question_suite_questions AS qsq LEFT JOIN questions AS q ON q.id = qsq.question_id WHERE qsq.question_suite_id = (SELECT question_suite_id FROM quiz WHERE id=$1)`;
        const values = [quizId];
        try {
            const result = await this.db.query(queryString, values);
            if (result.rowCount > 0) {
                const rows = convertKeysToCamelCase(result.rows)
                return rows;
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    findQuizSubmissionByUsernameAndQuizId = async(data: SubmitQuizParams) => {
        const queryString = `SELECT * FROM quiz_submissions WHERE username=$1 AND quiz_id=$2`;
        const values = [data.username, data.quizId];
        try {
            const result = await this.db.query(queryString, values);
            if (result.rowCount > 0) {
                const rows = convertKeysToCamelCase(result.rows)
                return rows;
            }
            return [];
        } catch (error) {
            return [];
        }
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

    submitQuiz = async(data: SubmitQuizParams) => {
        const queryString = `UPDATE quiz_submissions SET list_answer=$1, score=$2, number_of_questions=$3, number_of_correct_answers=$4, submission_time=$5 WHERE username=$6 AND quiz_id=$7`
        const values = [data.listAnswer, data.score, data.numberOfQuestions, data.numberOfCorrectAnswers,  getDateTimeWithFormat(), data.username, data.quizId];
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
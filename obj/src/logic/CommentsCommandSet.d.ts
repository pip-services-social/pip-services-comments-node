import { CommandSet } from 'pip-services3-commons-node';
import { ICommentsController } from './ICommentsController';
export declare class CommentsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ICommentsController);
    private makeGetCommentsCommand;
    private makeGetCommentByIdCommand;
    private makeCreateCommentCommand;
    private makeUpdateCommentCommand;
    private makeDeleteCommentByIdCommand;
}

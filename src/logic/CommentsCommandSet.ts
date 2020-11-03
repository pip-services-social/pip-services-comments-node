import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { CommentV1Schema } from '../data/version1/CommentV1Schema';
import { ICommentsController } from './ICommentsController';

export class CommentsCommandSet extends CommandSet {
	private _logic: ICommentsController;

	constructor(logic: ICommentsController) {
		super();

		this._logic = logic;

		// Register commands to the database
		this.addCommand(this.makeGetCommentsCommand());
		this.addCommand(this.makeGetCommentByIdCommand());
		this.addCommand(this.makeCreateCommentCommand());
		this.addCommand(this.makeUpdateCommentCommand());
		this.addCommand(this.makeDeleteCommentByIdCommand());
		this.addCommand(this.makeUpdateStateCommentCommand());
		this.addCommand(this.makeAddCommentMemeCommand());
		this.addCommand(this.makeRemoveCommentMemeCommand());
	}

	private makeGetCommentsCommand(): ICommand {
		return new Command(
			"get_comments",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.getComments(correlationId, filter, paging, callback);
			}
		);
	}

	private makeGetCommentByIdCommand(): ICommand {
		return new Command(
			"get_comment_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('comment_id', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let comment_id = args.getAsString("comment_id");
				this._logic.getCommentById(correlationId, comment_id, callback);
			}
		);
	}

	private makeCreateCommentCommand(): ICommand {
		return new Command(
			"create_comment",
			new ObjectSchema(true)
				.withRequiredProperty('comment', new CommentV1Schema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let comment = args.get("comment");
				this._logic.createComment(correlationId, comment, callback);
			}
		);
	}

	private makeUpdateCommentCommand(): ICommand {
		return new Command(
			"update_comment",
			new ObjectSchema(true)
				.withRequiredProperty('comment', new CommentV1Schema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let comment = args.get("comment");
				this._logic.updateComment(correlationId, comment, callback);
			}
		);
	}

	private makeDeleteCommentByIdCommand(): ICommand {
		return new Command(
			"delete_comment_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('comment_id', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let commentId = args.getAsNullableString("comment_id");
				this._logic.deleteCommentById(correlationId, commentId, callback);
			}
		);
	}

	private makeUpdateStateCommentCommand(): ICommand {
		return new Command(
			"update_comment_state",
			new ObjectSchema(true)
				.withRequiredProperty('id', TypeCode.String)
				.withRequiredProperty('state', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let id = args.get("id");
				let state = args.get("state");
				this._logic.updateCommentState(correlationId, id, state, callback);
			}
		);
	}

	private makeAddCommentMemeCommand(): ICommand {
		return new Command(
			"add_comment_meme",
			new ObjectSchema(true)
				.withRequiredProperty('id', TypeCode.String)
				.withRequiredProperty('creator_id', TypeCode.String)
				.withRequiredProperty('meme_type', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let id = args.get("id");
				let creatorId = args.get("creator_id");
				let memeType = args.get("meme_type");
				this._logic.addMemeToComment(correlationId, id, creatorId, memeType, callback);
			}
		);
	}

	private makeRemoveCommentMemeCommand(): ICommand {
		return new Command(
			"remove_comment_meme",
			new ObjectSchema(true)
				.withRequiredProperty('id', TypeCode.String)
				.withRequiredProperty('creator_id', TypeCode.String)
				.withRequiredProperty('meme_type', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let id = args.get("id");
				let creatorId = args.get("creator_id");
				let memeType = args.get("meme_type");
				this._logic.removeMemeFromComment(correlationId, id, creatorId, memeType, callback);
			}
		);
	}
}
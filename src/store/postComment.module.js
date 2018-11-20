import {
	POST_COMMENT,
	FETCH_COMMENT,
	FETCH_POST_LIST,
	REPLY_COMMENT,
	LIKE_COMMENT
} from "../store/actions.type";
import { POSTS } from "../database/db.documents";
import { SET_MODAL_COMMENT } from "./mutations.type";

import commentModel from "../models/comment.model";
import notiModel from "../models/noti.model";

import db from "../database/firestore";
import query from "../database/db.actions";

var state = {
	comment: [],
	order: {}
};
var getters = {
	comment() {
		return state.comment;
	}
};
var mutations = {
	[SET_MODAL_COMMENT](state, i) {
		state.comment = i;
		let a = {};
		if (i) {
			i.comment.forEach((e, index) => {
				a[e.commentID] = index;
			});
			state.order = a;
		}
	}
};
var actions = {
	[POST_COMMENT](c, i) {
		// query.
		let cmt = new commentModel(i);
		query.postComment(
			POSTS,
			db,
			i.id,
			cmt,
			() => {
				// c.dispatch(FETCH_POST_LIST);
				console.log("update success");
			},
			err => console.log(err)
		);
		console.log(i);

		if (i.ownerId != i.postOwnerId) {
			let noti = new notiModel({
				user: i.owner,
				userId: i.ownerId,
				type: 3,
				ownerId: i.postOwnerId,
				postId: i.postId,
				parentCmtID: "",
				commentID: "",
				userImg: i.userImg
			});
			console.log(noti);
			query.notifyUser(db, noti);
		}
	},
	[REPLY_COMMENT](c, i) {
		let reply = {};
		if (i.floor == 4) {
			let tagger = '<a class="text-primary">@' + i.owner + "</a>";
			reply = new commentModel({
				owner: i.user,
				ownerId: i.userId,
				content: i.reply,
				floor: i.floor,
				mentioned: tagger
			});
			query.replyComment(db, POSTS, i.postId, i.parentCmtID, reply);
		} else {
			reply = new commentModel({
				owner: i.user,
				ownerId: i.userId,
				content: i.reply,
				floor: i.floor + 1
			});
			query.replyComment(db, POSTS, i.postId, i.commentID, reply);
		}
		console.log(i);
		if (i.userId != i.parentCmtOwnerId) {
			let noti = new notiModel({
				user: i.user,
				userId: i.userId,
				type: 2,
				ownerId: i.parentCmtOwnerId,
				postId: i.postId,
				parentCmtID: i.parentCmtID,
				commentID: i.commentID,
				userImg: i.userImg
			});
			console.log(noti);
			query.notifyUser(db, noti);
		}
	},
	[LIKE_COMMENT](c, i) {
		console.log(i);
		query.likeComment(
			db,
			POSTS,
			i.id,
			i.commentID,
			i.email,
			i.parentCmtID,
			i.index
		);
	},
	[FETCH_COMMENT](c, id) {
		console.log(id);
		query.getPostComment(
			POSTS,
			db,
			id,
			doc => {
				c.commit(SET_MODAL_COMMENT, doc);
				console.log(doc);
			},
			err => console.log(err)
		);
	}
};
var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};

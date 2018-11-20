import { CREATE_NEW_POST, FETCH_POST_LIST } from "./actions.type";
import db from "../database/firestore";
import query from "../database/db.actions";
import postModel from "../models/post.model";

import { POSTS } from "../database/db.documents";

var state = {
	// user: "admin"
};
var getters = {};
var mutations = {};
var actions = {
	[CREATE_NEW_POST](c, i) {
		let post = {
			content: i.newPost.content.toString().trim(),
			title: i.newPost.title.toString().trim(),
			owner: i.user.name,
			ownerEmail: i.user.email,
			userId: i.user._id
		};
		let p = new postModel(post);
		query.createPost(
			POSTS,
			p,
			db,
			d => {
				console.log(d);
				// c.dispatch(FETCH_POST_LIST);
			},
			e => console.log(e)
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

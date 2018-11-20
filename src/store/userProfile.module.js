import { GET_USER_POST, GET_USER_LIKED_POST } from "./actions.type";
import { SET_USER_POST, SET_USER_LIKED_POST } from "./mutations.type";

import db from "../database/firestore";
import query from "../database/db.actions";

import { POSTS } from "../database/db.documents";

var state = {
	post: [],
	likedPost: []
};
var getters = {};
var mutations = {
	[SET_USER_POST](state, doc) {
		state.post = doc;
	},
	[SET_USER_LIKED_POST](state, doc) {
		state.post = doc;
	}
};
var actions = {
	[GET_USER_POST](c, i) {
		query.getUserPost(
			db,
			POSTS,
			i,
			doc => {
				c.commit(SET_USER_POST, doc);
			},
			err => console.log(err)
		);
	},
	[GET_USER_LIKED_POST](c, i) {
		query.getUserLikedPost(
			db,
			POSTS,
			i,
			doc => {
				c.commit(SET_USER_LIKED_POST, doc);
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

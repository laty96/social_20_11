import {
	FETCH_POST_LIST,
	FETCH_POST_LIST_SCROLL,
	LIKE_POST,
	SEARCH_POST,
	GET_POST,
	HIDE_POST,
	UNDO_HIDE_POST,
	BLOCK_USER
} from "./actions.type";
import {
	SET_POST,
	MOD_POST,
	DEL_POST,
	SET_POST_SCROLL
} from "./mutations.type";

import db from "../database/firestore";
import query from "../database/db.actions";

import { POSTS } from "../database/db.documents";
var state = {
	postList: [],
	unsub: Object,
	limit: null,
	post: {},
	unsubPost: Function
};
var getters = {
	post() {
		return state.postList;
	}
};
var mutations = {
	[SET_POST](state, post) {
		// state.postList = state.postList.concat(post);\
		// state.post = post.n[0];
		state.postList = post.n;
		state.unsub = post.u;
		state.limit = post.l;
	},
	[MOD_POST](state, post) {
		// state.postList[post.index] = post.mod;
		Object.assign(state.postList[post.index], post.mod);
	},
	[DEL_POST](state, post) {
		state.postList.splice(post, 1);
	},
	setPost(state, data) {
		state.post = data.doc;
		state.unsubPost = data.unsub;
	}
};

var actions = {
	[FETCH_POST_LIST](c, i) {
		if (!i.date) i.date = Date.now();
		query.fetchPosts(
			POSTS,
			"createdDate",
			db,
			(n, u, l) => {
				// console.log(n);
				c.commit(SET_POST, { n, u, l });
			},
			(mod, index) => {
				// console.log(mod);
				c.commit(MOD_POST, { mod, index });
			},
			del => {},
			e => {},
			"asc",
			i.date,
			i.operator,
			i.limit,
			i.name
		);
	},
	[GET_POST](c, i) {
		query.getPost(db, POSTS, i, (doc, unsub) => {
			c.commit("setPost", { doc, unsub });
		});
	},
	[HIDE_POST](c, i) {
		query.hidePost(db, "POSTS", i.id, i.userId);
	},
	[UNDO_HIDE_POST](c, i) {
		query.undoHidePost(db, "POSTS", i.id, i.userId);
	},
	[BLOCK_USER](c, i) {
		query.blockUser(db, "users", i);
	},
	[LIKE_POST](c, i) {
		query.likePost(
			POSTS,
			db,
			i.id,
			i.user,
			doc => console.log(doc),
			err => console.log(err)
		);

		// c.dispatch(FETCH_POST_LIST);
	}
	// [SEARCH_POST](c, text) {
	// 	query.searchQuery(POSTS, 'title', ;
	// }
};
var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};

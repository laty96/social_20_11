<template>
  <div class="modal-wrapper" :style="{width: isMobile ? 'auto' : '80%'}">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">{{i.title}} 
				<router-link class="close float-right" to='/'>
					<i class="fas fa-times"></i>
				</router-link>
				</h5>
        <small>Posted by </small><small class="text-primary">{{i.owner}}</small><span class="badge badge-light text-secondary">{{cvDate(i.createdDate)}}</span>
      </div>
      <div class="card-body" :class="{'p-1': isMobile}">
        <div class="card-text" :class="{'p-2': isMobile}">{{i.content}} 
        </div>
        <hr>
        <div class="form-group p-2" v-if="userInfo.name">
					<label for="comment-input">Comment as <small>{{userInfo.name}}</small></label>
					<textarea class="form-control" id="comment-input" rows="4" v-model="newComment.content"></textarea>
					<button class="form-control btn btn-secondary my-2" v-bind:class="{'disabled': !newComment.content}" @click="postComment">Comment</button>
        </div>
        <div class="">
          <div class="d-flex dropdown custom-control-inline">
						<button type="button" class="btn  btn-sm btn-light dropdown-toggle mr-auto" data-toggle="dropdown">
							<code>Sort by:</code> <span class="badge badge-secondary p-1"> {{sortTypeValue}}</span>
						</button>
						<div class="dropdown-menu">
							<a @click="sortComment(1)" class="dropdown-item" v-bind:class="{active: sortType == 1}" href="#">Best</a>
							<a @click="sortComment(2)" class="dropdown-item" v-bind:class="{active: sortType == 2}" href="#">New</a>
							<a @click="sortComment(3)" class="dropdown-item" v-bind:class="{active: sortType == 3}" href="#">Old</a>
						</div>
						<div class="btn-group btn-group-sm">
							<button type="button" class="btn btn-light shadow-sm" @click.stop="likePost(i)" :class="{'text-primary': isLike}">
							<i class="fas fa-thumbs-up"></i> Like</button>
						</div>
					</div>
				</div>
				<hr>
				<div v-for="(c, k) in commentList.comment" :key="c.commentID" >
					<div v-if="loading" class="align-content-center" style="text-align: center">
						<div id="loader-7">
							<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
						</div>
					</div> 
          <dl v-else class="border-secondary border-left pl-1 ml-2">
						<dt>
						<i class="fas fa-caret-down collapse-caret rounded px-1" data-toggle="collapse" v-bind:data-target="'#'+c.commentID" v-if="commentList.reply ? commentList.reply[c.commentID] : false"></i>
						<small class="text-primary"> {{c.owner}}</small></dt>
            <dd>{{c.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(c.createdTime)}}</small></dd>
						<Reply :parentCmt="c" :commentID="c.commentID" :user="userInfo" :postId="i.id" :index="k"/>
						<dl class="border-secondary border-left pl-1 ml-2 collapse show" v-for="(q, k) in commentList.reply ? commentList.reply[c.commentID] : []" v-bind:id="''+c.commentID" :key="q.commentID" v-if="!commentList.reply.length"> 
							<dt>
							<i class="fas fa-caret-down collapse-caret rounded px-1" data-toggle="collapse" v-bind:data-target="'#'+q.commentID" v-if="commentList.reply[q.commentID] ? commentList.reply[q.commentID] : false" ></i>
							<small class="text-primary"> {{q.owner}}</small></dt>
							<dd>{{q.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(q.createdTime)}}</small></dd>
					    <Reply :parent2CmtID="c.commentID" :parentCmt="q" :commentID="q.commentID" :user="userInfo" :postId="i.id" :index="k"/>
							<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+q.commentID" v-for="(w, k) in commentList.reply[q.commentID]" :key="w.commentID"> 
								<dt>
								<i class="fas fa-caret-down collapse-caret rounded px-1" data-toggle="collapse" v-bind:data-target="'#'+w.commentID" v-if="commentList.reply[w.commentID] ? commentList.reply[w.commentID] : false" ></i>
								<small class="text-primary"> {{w.owner}}</small></dt>
								<dd>{{w.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(w.createdTime)}}</small></dd>
								<Reply :parent2CmtID="q.commentID" :parentCmt="w" :commentID="w.commentID" :user="userInfo" :postId="i.id" :index="k"/>
								<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+w.commentID" v-for="(e, k) in commentList.reply[w.commentID]" :key="e.commentID"> 
									<dt>
									<i class="fas fa-caret-down collapse-caret rounded px-1" data-toggle="collapse" v-bind:data-target="'#'+e.commentID" v-if="commentList.reply[e.commentID] ? commentList.reply[e.commentID] : false" ></i>
									<small class="text-primary"> {{e.owner}}</small></dt>
									<dd>{{e.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(e.createdTime)}}</small></dd>
									<Reply :parent2CmtID="w.commentID" :parentCmt="e" :commentID="e.commentID" :user="userInfo" :postId="i.id" :index="k"/>
									<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+e.commentID" v-for="(r, k) in commentList.reply[e.commentID]" :key="r.commentID"> 
										<dt>
										<i class="fas fa-caret-down collapse-caret rounded px-1" data-toggle="collapse" v-bind:data-target="'#'+r.commentID" v-if="commentList.reply[r.commentID] ? commentList.reply[r.commentID] : false" ></i>
										<small class="text-primary"> {{r.owner}}</small></dt>
										<dd>{{r.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(r.createdTime)}}</small></dd>
										<Reply :parent2CmtID="e.commentID" :parentCmt="r" :commentID="r.commentID" :user="userInfo" :postId="i.id" :index="k"/>
										<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+r.commentID" v-for="(t, k) in commentList.reply[r.commentID]" :key="t.commentID"> 
											<dt>
											<small class="text-primary"> {{t.owner}}</small></dt>
											<dd><div v-if="t.mentioned" v-html="t.mentioned"></div> &nbsp; {{t.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(r.createdTime)}}</small></dd>
											<Reply :parent2CmtID="r.commentID" :parentCmt="t" :commentID="t.commentID" :user="userInfo" :postId="i.id" :index="k"/>
										</dl>
									</dl>
								</dl>
							</dl>
						</dl>
            <hr>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Reply from "./Reply";

import {
	POST_COMMENT,
	FETCH_COMMENT,
	FETCH_POST_LIST,
	LIKE_POST,
	REPLY_COMMENT,
	GET_POST
} from "../store/actions.type";

import { sortCmt, convertDate, isMobile } from "../utilities/index";

export default {
	name: "ViewPost",
	components: {
		Reply
	},
	data() {
		return {
			isLike: "",
			newComment: {
				content: ""
			},
			sortType: 2,
			commentList: [],
			isReplied: true,
			isMobile: isMobile.any() ? true : false,
			loading: true
		};
	},
	computed: {
		...mapState({
			i: state => state.postView.post,
			comment: state => state.postComment.comment,
			userInfo: state => state.auth.userInfo
		}),
		sortTypeValue() {
			if (this.sortType == 1) return "Best";
			else if (this.sortType == 2) return "New";
			else if (this.sortType == 3) return "Old";
		}
	},
	watch: {
		comment(n) {
			this.commentList = Object.assign({}, this.commentList, this.comment);
			if (this.commentList.comment) {
				if (this.sortType == 1) {
					let a = sortCmt(this.commentList.comment, "like", false);
					this.commentList.comment = a;
				} else if (this.sortType == 2) {
					let a = sortCmt(this.commentList.comment, "createdTime", true);
					this.commentList.comment = a;
				} else if (this.sortType == 3) {
					let a = sortCmt(this.commentList.comment, "createdTime", false);
					this.commentList.comment = a;
				}
			}
			this.$forceUpdate();
		},
		i() {
			document.title = this.i.title;
			this.loading = false;
			this.$store.dispatch(FETCH_COMMENT, this.i.id);
			this.isLike = this.checkLike(this.i.like);
		}
	},
	methods: {
		cvDate: convertDate,
		postComment() {
			if (this.newComment.content) {
				let a = {
					id: this.i.id,
					content: this.newComment.content,
					createdTime: Date.now(),
					owner: this.userInfo.name,
					ownerId: this.userInfo._id,
					postOwnerId: this.i.userId,
					postId: this.i.id,
					userImg: this.userInfo.imgURL
				};
				this.$store.dispatch(POST_COMMENT, a);
				this.newComment.content = "";
				window.setTimeout(() => {
					this.commentList = this.comment;
				}, 1000);
			}
		},
		sortComment(type) {
			this.sortType = type;
			if (type == 1) {
				let a = sortCmt(this.commentList.comment, "like", false);
				this.commentList.comment = a;
			} else if (type == 2) {
				let a = sortCmt(this.commentList.comment, "createdTime", true);
				this.commentList.comment = a;
			} else if (type == 3) {
				let a = sortCmt(this.commentList.comment, "createdTime", false);
				this.commentList.comment = a;
			}
		},
		likePost(i) {
			if (!this.userInfo.email) this.$router.push("/login");
			else {
				i.isLiked = !i.isLiked;
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo.email
				});
				this.$forceUpdate();
			}
		},
		checkLike(i) {
			console.log(this.i);
			if (i.length > 0)
				return i.indexOf(this.userInfo.email) < 0 ? false : true;
		}
	},
	created() {
		this.$store.dispatch(GET_POST, this.$route.params.postId);
	},
	destroyed() {
		document.title = "Noname";
	}
};
</script>

<style>
.modal-wrapper {
	padding-top: 8px;
	margin: 0 auto;
}

textarea {
	resize: none;
}
.collapse-caret {
	cursor: pointer;
}
.collapse-caret:hover {
	background: lightgrey;
}
.v--modal-box.v--modal {
	transition: all 0.2s ease-in-out;
}
</style>

<template>
	<div id="post-view">
		<!--
			<div class="btn-group btn-group-sm my-2">
				<button class="btn btn-light" @click="prev"><i class="fas fa-arrow-left"></i></button>
				<button class="btn btn-light" @click="next"><i class="fas fa-arrow-right"></i></button>
			</div>
		-->
		<div class="card shadow-sm post-view border border-light" :class="{ 'mb-2': !isMobile }" v-for="(i, k) in post" :key="i[k]" v-if="isBlocked(i.userId)">
			<div class="card-body" :id="i._id" @click="show($event, i);" v-if="isHide(i.hideList)">
				<div class="dropdown float-right">
					<a class="close" data-toggle="dropdown" href="javascript:void(0)"> <i class="fas fa-ellipsis-h fa-sm other-function"></i></a>
					<div class="dropdown-menu dropdown-menu-right">
						<a class="dropdown-item other-function small" href="javascript:void(0)" v-if="i.userId != userInfo._id" @click.stop="hidePost(i.id);">Hide</a>
						<a class="dropdown-item other-function small" href="javascript:void(0)" v-if="i.userId != userInfo._id" @click.stop="hideAll(i);">Hide all from {{ i.owner }}</a>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item other-function small" href="javascript:void(0)" v-if="i.userId == userInfo._id">Delete</a>
						<a class="dropdown-item other-function small" :href="'#/posts/' + i._id + '/' + trimTitle(i.title)">Open</a>
					</div>
				</div>
				<small>Posted by </small><small class="text-primary">{{ i.owner }}</small
				><span class="badge badge-light"
					><small>{{ cvDate(i.createdDate) }}</small></span
				>
				<h5 class="card-title">
					<a :href="'#/posts/' + i._id + '/' + trimTitle(i.title)" onclick="return false;">{{ k }} {{ i.title }}</a>
				</h5>
				<p class="card-text">{{ i.content }}</p>
				<div class="btn-group btn-group-sm">
					<button type="button" class="btn btn-secondary">
						<i class="fas fa-comment"></i> {{ i.comment.length > 0 ? i.comment.length : "" }} {{ i.comment.length > 1 ? "Comments" : "Comment" }}
					</button>
					<button type="button" class="btn btn-secondary" @click.stop="likePost(i, k);">
						<i class="fas fa-thumbs-up" v-bind:class="{ 'text-primary': checkLiked(i) }"></i> {{ i.like.length > 0 ? i.like.length : "" }} Like
					</button>
					<button type="button" class="btn btn-secondary" @click.stop="sharePost(i);"><i class="fas fa-share"></i> Share</button>
				</div>
			</div>
			<div class="card-body p-0" data-toggle="collapse" :data-target="'#' + i._id + 'hide'" aria-expanded="false" aria-controls="collapseExample" v-else>
				<a class="card-body d-block" href="javascript:void(0)"> {{ i.title.substr(0, 50) }} ... <i class="fas fa-chevron-down float-right py-1"></i> </a>
				<div class="collapse list-group list-group-flush" :id="i._id + 'hide'">
					<a class="list-group-item list-group-item-action small" href="javascript:void(0)" @click.stop="hideAll(i);">Hide all from {{ i.owner }}</a>
					<a class="list-group-item list-group-item-action small" href="javascript:void(0)" @click.stop="undoHide(i.id);">Undo hide</a>
					<a class="list-group-item list-group-item-action small" :href="'#/posts/' + i._id + '/' + trimTitle(i.title)"> Open</a>
				</div>
			</div>
		</div>
		<modal name="view-post"> </modal>
		<v-dialog />
	</div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { convertDate, isMobile } from "../utilities";

import { FETCH_POST_LIST, LIKE_POST, HIDE_POST, UNDO_HIDE_POST, BLOCK_USER } from "../store/actions.type";
import modal from "./Modal";

export default {
	name: "PostView",
	data() {
		return {
			isMobile: isMobile.any() ? true : false,
			timeout: null
		};
	},
	props: {
		userInfo: Object
	},
	computed: {
		...mapState({
			post: state => state.postView.postList,
			unsub: state => state.postView.unsub,
			limit: state => state.postView.limit,
			hideList: state => state.auth.userInfo.hideList
		})
	},
	watch: {
		post(n) {
			console.log(111111111);
			// console.log(n)
			this.$forceUpdate();
		},
		userInfo() {
			this.$forceUpdate();
		}
	},
	beforeCreate() {
		this.$store.dispatch(FETCH_POST_LIST, {
			date: Date.now(),
			operator: "<",
			limit: 10
		});
	},
	methods: {
		isBlocked(i) {
			if (this.userInfo.blockedUser) return this.userInfo.blockedUser.filter(u => u == i).length ? false : true;
			else return true;
		},
		trimTitle(title) {
			return title.replace(/[^A-Z0-9]+/gi, "_").substr(0, 30);
		},
		isHide(hideList) {
			return hideList ? hideList.indexOf(this.userInfo._id) : true;
		},
		likePost(i, k) {
			if (this.userInfo.email) {
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo._id
				});
			} else {
				this.$router.push("/login");
			}
			console.log(this.post);
		},
		hidePost(id) {
			console.log(this.userInfo.hideList);
			this.$store.dispatch(HIDE_POST, { id, userId: this.userInfo._id });
			this.$forceUpdate();
		},
		undoHide(id) {
			console.log(id);
			this.$store.dispatch(UNDO_HIDE_POST, { id, userId: this.userInfo._id });
		},
		hideAll(i) {
			this.$store.dispatch(BLOCK_USER, {
				id: this.userInfo.id,
				userId: i.userId
			});
		},
		show($event, i) {
			if (!$event.target.classList.contains("other-function")) {
				history.pushState(null, "", "#/posts/" + i._id + "/" + this.trimTitle(i.title));
				this.$modal.show(
					modal,
					{ i, isMobile },
					{
						height: "auto",
						width: this.isMobile ? "100%" : "80%",
						style: { "z-index": 9000 },
						scrollable: true
					},
					{
						closed: this.hide
					}
				);
			}
		},
		hide() {
			this.$modal.hide("view-post");
			history.pushState(null, "", "/");
		},
		cvDate: convertDate,
		checkLiked(i) {
			return i.like.indexOf(this.userInfo._id) >= 0;
		},
		sharePost(i) {
			let urlT = "https://4x2939pp80.codesandbox.io/%23/posts/" + i._id + "/" + this.trimTitle(i.title);
			let urlF = "https://4x2939pp80.codesandbox.io/#/posts/" + i._id + "/" + this.trimTitle(i.title);
			let url = "";
			$.get("https://dct.glitch.me/sht/new/" + urlT, function(data, status) {
				url = data.short_url;
				if (document.getElementById("sharedLink")) document.getElementById("sharedLink").value = url;
				return url;
			});
			this.$modal.show("dialog", {
				title: "Share post",
				text: `<div class="input-group">
									<input type="text" value="${url}" id="sharedLink" class="form-control" readonly>
									<div class="input-group-append">
										<button class="btn btn-outline-secondary" onclick="(function(){
											document.getElementById('sharedLink').select();
											document.getElementById('alert').classList.remove('text-hide');
											document.execCommand('copy');
										})(); return false;"><i class="fas fa-copy"></i></button>
									</div>
								</div>
								<div class="alert alert-success my-1 p-1 text-center text-hide" id="alert">
									Link has been copied to clipboard
								</div>
								`,
				buttons: [
					{
						title: "Copy link",
						handler: this.copyLink
					},
					{
						title: '<a id="shareTwitter" target="_blank" href="http://twitter.com/share?url=' + urlT + '"><i class="fab fa-twitter fa-2x"></i></a>',
						handler: () => {
							document.getElementById("shareTwitter").click();
						}
					},
					{
						title: '<a id="shareFacebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + urlF + '"><i class="fab fa-facebook fa-2x"></i></a>',
						handler: () => {
							document.getElementById("shareFacebook").click();
						}
					},
					{
						title: "Close"
					}
				]
			});
		},
		copyLink() {
			clearTimeout(this.timeout);
			let sharedLink = document.getElementById("sharedLink");
			let alert = document.getElementById("alert");
			if (sharedLink.value != "") {
				sharedLink.select();
				alert.classList.remove("text-hide");
				this.timeout = setTimeout(() => {
					alert.classList.add("text-hide");
				}, 5000);
				document.execCommand("copy");
				document.getSelection().removeAllRanges();
			}
		},
		prev() {
			this.unsub();
			this.limit - 10 < 0 ? (this.limit = 10) : (this.limit = this.limit - 10);
			this.$store.dispatch(FETCH_POST_LIST, {
				date: this.post[0].createdDate,
				operator: ">",
				limit: this.limit
			});
		},
		next() {
			this.unsub();
			this.$store.dispatch(FETCH_POST_LIST, {
				date: this.post[this.post.length - 1].createdDate,
				operator: "<",
				limit: this.limit + 10
			});
		}
	}
};
</script>

<style scoped>
.post-view {
	cursor: pointer;
}
.post-view:hover {
	border: 1px solid var(--dark) !important;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.hide-post {
	border: 0;
	height: 0;
}
</style>

<template>
  <div class="py-3 col-md-9" id="post-view">
		<div v-if="post.length == 0">
			No post found!
		</div>
    <div v-else class="card shadow post-view" v-for="(i, k) in post" :key="i[k]" @click="show(i)">
      <div class="card-body">
        <h5 class="card-title">{{i.title}}
        </h5>
        <small>Posted by </small><small class="text-primary">{{i.owner}}</small><span class="badge badge-light"><small>{{cvDate(i.createdDate)}}</small></span>
				<div class="btn-group btn-group-sm btn-block">
					<button type="button" class="btn btn-light">
            <i class="fas fa-comment"></i> {{i.comment.length > 0 ? i.comment.length : '' }} {{i.comment.length > 1 ? 'Comments' : 'Comment'}}</button>
					<button type="button" class="btn btn-light" @click.stop="likePost(i, k)">
            <i class="fas fa-thumbs-up" v-bind:class="{'text-primary' : checkLiked(i) }"></i>  {{i.like.length > 0 ? i.like.length : ''}} Like</button>
					<button type="button" class="btn btn-light" @click.stop="sharePost(i)"><i class="fas fa-share"></i> Share</button>
				</div>
      </div>
    </div>
		<modal name="view-post">
    
		</modal>
		<v-dialog/>

  </div>
</template>

<script>
import { mapState } from "vuex";

import { convertDate, isMobile } from "../utilities";
import modal from "./Modal";
import {
	GET_USER_LIKED_POST,
	GET_USER_POST,
	LIKE_POST
} from "../store/actions.type";

export default {
	name: "UserPost",
	props: {
		userId: String,
		type: String
	},
	data() {
		return {
			posts: [],
			t: ''
		};
	},
	computed: mapState({
		post: state => state.userProfile.post,
		userLikedPost: state => state.userProfile.likePost,
		userInfo: state => state.auth.userInfo
	}),
	watch: {
		$route() {
			this.t = this.type == 'posts' ?  GET_USER_POST : GET_USER_LIKED_POST
			this.$store.dispatch(this.t, this.userId);
		}
	},
	methods: {
		likePost(i, k) {
			if (this.userInfo.email) {
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo.email
				});
			} else {
				this.$router.push("/login");
			}
		},
		trimTitle(title) {
			return title.replace(/[^A-Z0-9]+/ig, "_")
		},
		sharePost	(i) {
			let urlT = 'https://4x2939pp80.codesandbox.io/%23/posts/'+i._id+'/'+ this.trimTitle(i.title);
			let urlF = 'https://4x2939pp80.codesandbox.io/#/posts/'+i._id+'/'+ this.trimTitle(i.title);
			this.$modal.show('dialog', {
				title: 'Share post',
				text: `<div class="input-group">
									<input type="text" value="${urlF}" id="sharedLink" class="form-control" readonly>
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
								`
				,
				buttons: [
					{
						title: 'Copy link',
						handler: this.copyLink
					},
					{
						title: '<a id="shareTwitter" target="_blank" href="http://twitter.com/share?url=' + urlT + '"><i class="fab fa-twitter fa-2x"></i></a>',
						handler: () => {
							document.getElementById('shareTwitter').click()
						}
					},
					{
						title: '<a id="shareFacebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + urlF + '"><i class="fab fa-facebook fa-2x"></i></a>',
						handler: () => {
							document.getElementById('shareFacebook').click()
						}
					},
					{
						title: 'Close'
					}
			]
			})
		},
		copyLink() {
			clearTimeout(this.timeout);
			let sharedLink = document.getElementById('sharedLink');
			let alert = document.getElementById('alert');
			sharedLink.select();
			alert.classList.remove("text-hide");
			this.timeout = setTimeout(() => {
				alert.classList.add("text-hide");
			}, 5000);
			document.execCommand('copy');
			document.getSelection().removeAllRanges();
		},
		show(i) {
			this.$modal.show(
				modal,
				{ i, isMobile: isMobile.any() },
				{
					height: "auto",
					width: isMobile.any() ? "100%" : "80%",
					style: { "z-index": 9000 },
					scrollable: true
				},
				{
					closed: this.hide
				}
			);
		},
		hide() {
			this.$modal.hide("view-post");
		},
		cvDate: convertDate,
		checkLiked(i) {
			return i.like.indexOf(this.userInfo.email) >= 0;
		}
	},
	beforeMount() {
		
		let t = this.type == 'posts' ?  GET_USER_POST : GET_USER_LIKED_POST
		console.log(t)
		this.$store.dispatch(t, this.userId);
	}
};
</script>

<style>
.post-view {
	cursor: pointer;
}
.post-view:hover {
	border: 1px solid grey;
}
</style>

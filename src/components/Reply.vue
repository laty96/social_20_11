<template>
  <div>
    <ul class="list-inline mx-2">
      <li class="list-inline-item" @click.stop="replyComment">
        <a href="javascript:void(0)" class="text-secondary">
          <small><i class="fas fa-reply"></i> Reply </small>
        </a>
      </li>
    </ul>
    <div v-show="isReplied" >
      <textarea cols="30" rows="1" class="form-control p-2 m-2" v-model="reply" autofocus></textarea>
      <ul class="list-inline mx-2">
        <a href="javascript:void(0)" class="list-inline-item text-secondary" @click.stop="replyComment">Cancel</a>
        <a href="javascript:void(0)" class="list-inline-item" :disabled="!reply" :class="{'text-secondary': !reply}" @click.stop="onReply">Reply</a>
      </ul>
    </div>
  </div>
</template>

<script>
import { REPLY_COMMENT, LIKE_COMMENT } from "../store/actions.type";

export default {
	name: "Reply",
	props: {
		commentID: String,
		parentCmt: Object,
		parent2CmtID: String,
		user: Object,
		postId: String,
		index: Number
	},
	data() {
		return {
			cmtId: this.commentID,
			prCmt: this.parentCmt,
			isReplied: false,
			reply: ""
		};
	},
	methods: {
		replyComment(k) {
			if (!this.user) {
				this.$emit("close");
				this.$router.push("/login");
			} else this.isReplied = !this.isReplied;
			console.log(this.parentCmt);
		},
		onReply() {
			console.log(this.reply);
			if (!this.user.email) {
				this.$emit("close");
				this.$router.push("/login");
			} else {
				let a = {
					commentID: this.parentCmt.commentID,
					parentCmtID: this.parent2CmtID || this.postId,
					postId: this.postId,
					reply: this.reply,
					floor: this.parentCmt.floor,
					user: this.user.name,
					userId: this.user._id,
					userImg: this.user.imgURL,
					parentCmtOwnerId: this.parentCmt.ownerId
				};
				console.log(a);
				if (this.reply.length) this.$store.dispatch(REPLY_COMMENT, a);

				this.reply = "";
				this.isReplied = false;
			}
		},
		likeComment() {
			if (!this.user) {
				this.$emit("close");
				this.$router.push("/login");
			} else {
				this.$store.dispatch(LIKE_COMMENT, {
					commentID: this.parentCmt.commentID,
					parentCmtID: this.parent2CmtID,
					index: this.index,
					id: this.postId,
					email: this.user.email
				});
			}
		}
	}
};
</script>

<style>
</style>

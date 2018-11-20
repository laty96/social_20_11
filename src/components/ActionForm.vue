<template>
  <div class="card mb-3 shadow" v-if="user.name">
    <div class="card-hearder">
    </div>
    <div class="card-body">
      <div class="form-group">
        <label for="title">Title: </label>
        <input class="form-control" type="text" id="title" v-model="newPost.title" autocomplete="off">
        <label for="comment">Content:</label>
        <textarea class="form-control" rows="5" v-model="newPost.content" @paste="onPaste"></textarea>
        <button class="btn float-right mt-3" v-bind:class="{'disabled': !newPost.title}" @click="submitPost">Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import { CREATE_NEW_POST, FETCH_POST_LIST } from '../store/actions.type'

export default {
	name: "ActionForm",
	data() {
		return {
      newPost: {
        content: '',
        title: '',
        tag: []
      }
    }
	},
  props: {
    user: Object
  },
  // computed: {
  //   user() {
  //     return this.$store.getters.userInfo
  //   }
  // },
  methods: {
    submitPost() {
      let newPost = this.newPost;
      let user = this.user;

      if (this.newPost.title) {
         this.$store.dispatch(CREATE_NEW_POST, {newPost, user})
         this.newPost = {
            content: '',
            title: ''
          }

      }
    },
    onPaste(e) {
      console.log(this.user)

      console.log(e)
      return true;
    }
  }
};
</script>

<style scoped>
textarea {
  resize: none;
}
.clickable {
  cursor: not-allowed;

}
</style>

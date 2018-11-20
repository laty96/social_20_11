<template>
  <div class="page-content col-md-8 py-3 px-0">
    <ActionForm :user="userInfo"/>
    <PostView :userInfo="userInfo"/>
  </div>
</template>

<script>
import ActionForm from './ActionForm'
import PostView from './PostView'

export default {
	name: "PageContent",
  components: {
    ActionForm,
    PostView
  },
  props: {
    userInfo: Object
  }
};
</script>

<style>
</style>

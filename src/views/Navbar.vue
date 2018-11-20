<template>
  <div>
    <nav class="shadow-sm navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <router-link class="navbar-brand" to="/">Home</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <!--<li class="nav-item" v-if="getUsername">
            <router-link to="/friends-posts" class="nav-link">Friends</router-link>
          </li>-->
          <!-- <li class="nav-item">
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="W.I.P" aria-label="Search" v-model="searchText" >
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click.prevent="searchPost">Search</button>
            </form>
          </li> -->
          <li class="nav-item" v-if="!getUserStatus">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
        </ul>
				<ul class="navbar-nav">
					<li class="nav-item notify-dropdown" v-if="getUserStatus">
            <div class="dropdown">
              <a href="#" class="nav-link" :class="{'text-primary': pendingRequests.length}" data-toggle="dropdown">
                <i class="fa-user-friends fas"></i><small class="notify-count bg-danger text-white" v-if="pendingRequests.length > 0">{{pendingRequests.length}}</small>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-0" :style="{ width: isMobile ? '95%' : ''}">
                <ul class="list-group list-group-flush" id="pendingRequests">
									<h5 class="dropdown-header">Friend requests</h5>
									<li class="dropdown-item list-group-item" style="cursor: pointer" v-for="request in pendingRequests" :key="request.id">
									<img class="px-1" style="height: 2em" :src="request.requesterImg" alt="">
										{{request.requesterName}} 
										<div class="btn-group btn-group-sm">
											<button class="btn btn-primary btn-sm" @click="acceptRequest(request)">Accept</button>
											<button class="btn btn-secondary btn-sm" @click="declineRequest(request)">Decline</button>
										</div>
									</li>
                </ul>
              </div>
            </div>
          </li>
				</ul>
				<ul class="navbar-nav">
          <li class="nav-item notify-dropdown" v-if="getUserStatus">
            <div class="dropdown" @click="notiRead()">
              <a href="#" class="nav-link" :class="{'text-primary': notify.length}" data-toggle="dropdown">
                <i class="fa-bell" :class="[notify.length ? 'fas' : 'far']"></i><small class="notify-count bg-danger text-white" v-if="notify.length > 0">{{notify.length}}</small>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-0" :style="{ width: isMobile ? '95%' : ''}">
                <ul class="list-group list-group-flush" id="notify">
                  <h5 class="dropdown-header" v-if="notify.length > 0">New</h5>
                  <li class="dropdown-item list-group-item" style="cursor: pointer" v-for="noti in friendNotify" :key="noti.id">
									{{noti.name}} rejected your friend request.
									</li>
                  <li class="dropdown-item list-group-item" style="cursor: pointer" v-for="noti in notify" :key="noti.id" @click="show(noti.postId)">
									<img class="px-1" style="height: 2em" :src="noti.userImg" alt="">
                    <a class="text-primary">{{noti.user}} </a> {{getType(noti.type)}} <small class="bg-light"> {{cvDate(noti.createdTime)}}</small>
                  </li>
                  <h5 class="dropdown-header">Old</h5>
                  <li class="dropdown-item list-group-item" v-for="noti in inactiveNotify" :key="noti.id"  @click="show(noti.postId)">
										<img class="px-1" style="height: 2em" :src="noti.userImg" alt="">
                    <a class="text-primary">{{noti.user}} </a> {{getType(noti.type)}} <small class="bg-light"> {{cvDate(noti.createdTime)}}</small>
                  </li>
                </ul>
              </div>
            </div>
          </li>
					<li class="nav-item notify-dropdown" v-if="getUserStatus">
            <div class="dropdown">
              <a href="#" class="nav-link"  data-toggle="dropdown">
                <i class="fa-comment" :class="[count ? 'fas' : 'far']"></i><small class="notify-count bg-danger text-white" v-if="count">{{count ? count : ''}}</small>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-0" :style="{ width: isMobile ? '95%' : ''}">
                <ul class="list-group list-group-flush" id="notifyChat" >
                  <li class="dropdown-item list-group-item py-1 rounded px-2" style="cursor: pointer" v-for="chat in chatList" :key="chat.id" :class="{'bg-light': chat.isNotified != userInfo.name && chat.hasNew}" 
									v-if="chat.membersName && chat.content.length" @click="readChat(chat)">
										<img class="px-1 float-left rounded-circle" style="height: 3em" :src="chat.membersImg[getMember(chat.membersEmail)]">
										<a>
											<a>{{chat.membersName[getMember(chat.membersEmail)]}}</a>
											<p class="small mb-0 text-secondary d-flex justify-content-between" style="max-width: 500px;overflow-x: hidden">
												 {{getChatOwner(chat.content)}} {{shortenMessage(chat.content)}}
												<small class="bg-light">{{calendarTime(chat.time)}}</small> 
											</p>
										</a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
					<li class="nav-item dropdown" v-if="getUserStatus">
						<a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
							{{getUsername }}
						</a>
						<div class="dropdown-menu dropdown-menu-left">
							<router-link to="/profile" class="dropdown-item">Profile</router-link>
							<a href="" class="dropdown-item" v-on:click.prevent="signOut" v-if="getUserStatus">Sign out</a>
						</div>
          </li>
				</ul>
      </div>
    </nav>
	
    <modal name="view-post">
    
		</modal>
  </div>
</template>

<script>
import {
	GET_NOTIFICATION,
	REMOVE_USER,
	NOTIFY_READ,
	GET_POST,
  GET_INACTIVE_NOTIFICATION,
	GET_CHAT_LIST,
	CHAT_NOTIFY_READ,
	GET_FRIENDS_POST
} from "../store/actions.type";
import { convertShortDate, isMobile, calendarTime } from "../utilities";
import { mapState } from "vuex";
import modal from "../components/Modal";
import SideMenu from "../components/SideMenu";


export default {
	name: "Navbar",
  components: {
    SideMenu
  },
	data() {
		return {
			black: false,
			isMobile: isMobile.any() ? true : false,
			title: document.title,
			count: 0
		};
	},
	watch: {
		notify() {
			if (this.notify.length) {
				document.title = '(' + this.notify.length + ')' + this.title;
			};
		},
		chatList() {
			console.log(this.chatList)
			console.log(12321312)
			let a = 0;
			this.chatList.forEach(chat => {
				if (chat.isNotified != this.userInfo.name && chat.hasNew == true) {
					a++;
					let audio = new Audio(
							"https://facebook.design/public/sounds/Notification%201.mp3"
						);
						audio.preload = "auto";
						setTimeout(() => {
							audio.play();
						}, 250)
				};
			})
			this.count = a;
			a != 0 || this.notify.length != 0 ? document.title = '('+ (a + this.notify.length) + ')' + ' ' + this.title : '';
		}
	},
	computed: {
		...mapState({
			unsub: state => state.postView.unsubPost,
			post: state => state.postView.post,
			userInfo: state => state.auth.userInfo,
			getUserStatus: state => state.auth.userInfo.status,
			getUsername: state => state.auth.userInfo.name,
			notify: state => (state.auth.notify ? state.auth.notify : []),
			inactiveNotify: state =>
				state.auth.inactiveNoti ? state.auth.inactiveNoti : [],
			chatList: state => state.chat.chatList,
			pendingRequests: state => state.auth.pendingRequests,
			friendNotify: state => state.auth.friendNotify
		})
	},
	methods: {
		cvDate(d) {
			return convertShortDate(d);
		},
		calendarTime(d) {
			return calendarTime(d)
		},
		getMember(membersEmail) {
			return membersEmail.indexOf(this.userInfo.email) == 0 ? 1 : 0
		},
		shortenMessage(m) {
			if (m.length > 0) return m[m.length -1].message.length > 20 ? m[m.length -1].message.substr(0, 20) + '...' : m[m.length -1].message;
		},
		getChatOwner(o) {
			if (o.length > 0) return o[o.length - 1].owner == this.userInfo.name ? 'You:' : o[o.length - 1].owner +':';
		},
		signOut() {
			this.$store.dispatch(REMOVE_USER, this.userInfo);
		},
		getType(type) {
			if (type == 1) {
				return "mentioned you.";
			}
			if (type == 2) {
				return "replied your comment.";
			}
			if (type == 3) {
				return "comment in your post.";
			}
		},
		readChat(chat) {
			console.log(chat)
			this.$store.dispatch(CHAT_NOTIFY_READ, chat.membersId[0])
		},
		notiRead() {
		  document.getElementById('notify').addEventListener("scroll", this.scrollA);
			let a = this;
			setTimeout(function() {
				a.$store.dispatch(NOTIFY_READ, a.userInfo._id);
			}, 10000);
		},
		declineRequest(u) {
			this.$store.dispatch("DECLINE_REQUEST", {u: {_id: u.requester}, userInfo: {_id: this.userInfo._id}});
		},
		acceptRequest(u) {
			this.$store.dispatch("ACCEPT_REQUEST", u);
		},
		getFriendPost() {
			// this.$store.dispatch(GET_FRIENDS_POST, {friends: this.userInfo.friends, id: this.userInfo.id})
		},
		show(i) {
			this.$store.dispatch(GET_POST, i);
			setTimeout(() => {
				this.$modal.show(
					modal,
					{ i: this.post, isMobile: isMobile.any() },
					{
						height: "auto",
						width: isMobile.any() ? "100%" : "80%",
						style: { "z-index": 9000 },
						scrollable: true
					},
					{
						closed: this.hide
					},
					{
						"before-open": this.$forceUpdate(),
						"before-close": this.unsub()
					}
				)},
				200
			);
		},
		hide() {
			this.$modal.hide("view-post");
		},
    scrollA() {
      let ul = document.getElementById('notify');
      if (Math.floor(ul.offsetHeight + ul.scrollTop) == ul.scrollHeight) {
        let u = this.userInfo;
        u.limit = this.inactiveNotify.length + 10
        this.$store.dispatch(GET_INACTIVE_NOTIFICATION, u)
      }
    }
	},
  mounted() {
	},	
	destroyed() {
		document.getElementById('notify').removeEventListener("scroll", this.scrollA);
	}
};
</script>

<style scoped>
.notify-count {
	text-align: center;
	box-sizing: border-box;
	border: 1.5px solid white;
	left: 16px;
	border-radius: 50%;
	height: 14px;
	width: 14px;
	position: absolute;
	line-height: 11px;
	font-size: 0.7em !important;
}

.notify-dropdown .dropdown-menu.show ul{
  max-height: 500px;
  overflow-y: auto;
}
.list-group.list-group-flush::-webkit-scrollbar,.list-group.list-group-flush::-webkit-scrollbar-thumb,.list-group.list-group-flush::-webkit-scrollbar-track {
	display: none;
}
.list-group.list-group-flush:hover::-webkit-scrollbar,.list-group.list-group-flush:hover::-webkit-scrollbar-thumb,.list-group.list-group-flush:hover::-webkit-scrollbar-track {
	display: block;
}
.list-group.list-group-flush:hover::-webkit-scrollbar {
  width: 10px;
}
 
.list-group.list-group-flush:hover::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 20px;
}

.list-group.list-group-flush:hover::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 20px;
}
#notifyChat {
	min-width: 400px;
}
</style>

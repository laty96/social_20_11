<template>
	<div class="chat-box" :style="style" :id="'chatbox__' + index">
		<div class="">
			<div class="card shadow" style="max-height: 375px; min-height: 375px">
				<div class="chat-header card-header py-1 my-0 btn" :class="isFocus ? 'bg-primary' : 'bg-light'" @click="minimizeChat(index);">
					<i class="fas fa-circle fa-xs" :class="{ 'text-success': user.status }"></i>
					<a :class="isFocus ? 'text-white' : 'text-secondary'"> {{ user.name.length > 20 ? user.name.substr(0, 20) + "..." : user.name }}</a>
					<small class="notify-count bg-danger text-white" v-if="notify > 0"> {{ notify }}</small> <button class="close float-right" @click.stop="onCLick(index);">&times;</button>
				</div>
				<div class="border" id="dropzone" @drop.prevent="dropImage($event);" @dragover.prevent @dragenter="dragEnter($event);" @dragleave="dragLeave($event);">
					<div
						class="card-body"
						:class="{ minimize: minimize }"
						style="overflow-y: auto"
						:id="user._id"
						:style="{
							height: paths.length || filePaths.length ? '160px' : '250px'
						}"
					>
						<div class="chat-wrapper d-flex" style="margin: 2px; width: 100%" v-for="m in getConver[index].content" :key="m.createdTime">
							<span
								class="py-1 px-2 small"
								style="max-width: 70%"
								data-toggle="tooltip"
								data-placement="top"
								:title="cvDate(m.createdTime)"
								:class="[m.owner != user.name ? 'my-chat bg-primary text-white float-right text-left ml-auto' : 'other-chat bg-secondary text-white mr-auto', user._id]"
							>
								<div v-emoji:message="m.message"></div>
								<div class="image-holder d-flex justify-content-around flex-wrap" v-if="m.img">
									<div
										class="image-message border border-white m-1"
										v-for="(image, k) in m.img"
										:key="k"
										:style="{
											backgroundImage: 'url(' + image + ')',
											cursor: 'pointer'
										}"
										@click="show(image, m.img);"
									></div>
								</div>
								<div class="d-flex flex-column">
									<a v-for="(file, k) in m.file" :key="k" :href="file.url" target="_blank" class="text-white"> {{ file.name }} </a>
								</div>
							</span>
						</div>
					</div>
					<div class="emoji-picker" v-if="emojiPicker">
						<Picker
							:set="'twitter'"
							:native="false"
							:emojiTooltip="true"
							:showPreview="false"
							:style="{
								position: 'absolute',
								bottom: '37px',
								left: '0px',
								width: '283px',
								zIndex: 300
							}"
							@select="selectEmoji($event);"
						/>
					</div>
					<div class="d-flex flex-column" :class="{ minimize: minimize }">
						<div class="emoji-suggest bg-light border-top" v-show="matchesEmoji.length < 0" style="overflow-y: scroll">
							<ul class="list-inline p-2">
								<li
									style="height: 2em"
									class="list-inline-item message pl-1 m-auto"
									v-for="emoji in matchesEmoji"
									:key="emoji.colons"
									:title="emoji.colons"
									@click="replaceEmoji(emoji);"
									v-emoji:emoji="emoji.colons"
								></li>
							</ul>
						</div>
						<div class="emoji-suggest bg-light border-top d-flex flex-wrap" v-if="paths.length || filePaths.length">
							<div
								v-for="(image, k) in paths"
								:key="k"
								class="uploaded-image"
								:style="{
									backgroundImage: 'url(' + images[k] + ')',
									cursor: 'pointer'
								}"
								v-if="images[k]"
								@click.stop="show(images[k]);"
							>
								<button class="close bg-white" style="width: 17px;height: 17px;line-height: 20px" @click.stop="removeImage(k);" v-if="images[k]">&times;</button>
								<div
									style="
									text-align: center;
									width: 50%;
									height: 100%;
							"
									class="m-auto"
									v-else
								>
									<i class="m-auto fas fa-lg fa-spinner fa-spin" style="line-height: 60px;"></i>
								</div>
							</div>

							<ul class="uploaded-file list-group list-group-flush d-flex flex-column">
								<li class="list-group-item p-1" v-for="(p, k) in filePaths" :key="k" style="cursor: 'pointer'" title="Remove file" @click="removeFile(k);">{{ p.split("/")[1] }}</li>
							</ul>
						</div>
						<div
							contenteditable="true"
							:id="'chatInput__' + index"
							class="rounded-0 border-muted p-2 message border-top"
							:class="{ minimize: minimize }"
							style="overflow-y: auto; max-height: 62px"
							@keyup.exact.enter="sendMessage($event);"
							@keyup="searchEmoji($event);"
							@paste="pasteImage($event);"
						></div>
						<div class="card-footer border-0 bg-white d-flex flex-row message p-1" style="min-height: 32px" v-if="!isMobile">
							<a @click="emojiPicker = !emojiPicker;" style="cursor:pointer"> <img src="https://twemoji.maxcdn.com/2/72x72/1f600.png" class="emoji"/></a>
							<span class="ml-auto" @click="sendMessage();"> <i class="fas fa-reply"></i> </span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<modal name="view-post" :reset="true" :adaptive="true" :delay="100"> </modal>
	</div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import moment from "moment";
import { Picker, emojiIndex } from "emoji-mart-vue";

import { GET_CONVERSATION, SEND_MESSAGE, UPLOAD_IMAGE_TO_CHAT, REMOVE_UPLOAD_IMAGE, FILE_UPLOAD, REMOVE_UPLOAD_FILE } from "../store/actions.type";

export default {
	name: "ChatForm",
	components: {
		Picker
	},
	props: {
		user: Object,
		index: Number,
		limit: Function,
		isMobile: Boolean
	},
	data() {
		return {
			chat: [],
			minimize: false,
			isFocus: true,
			notify: 0,
			message: "",
			emojiPicker: false,
			emojiRegex: /(:[^\s]*(?:::[^:\s]*)*[^:\s]:)|(:[^\s]*(?:::[^:\s]*)*[^:\s])/g,
			emojiRegex2: /:\w{2,}:/g,
			matchesEmoji: [],
			emo: "",
			images: [], // url images
			files: [], // url file
			canSendMessage: true,
			hasImage: false,
			hasFile: false,
			paths: [], // img path "_id/time_image_name"
			filePaths: [], // file path
			realImage: [], // image file object
			realFile: [], // file object
			limitFiles: 10,
			converlength: 0,
			style: {
				right: this.isMobile ? 0 : (this.index >= this.limit() ? this.index - this.limit() : this.index) * 302 + 250 + "px",
				bottom: this.isMobile ? (this.index >= this.limit() ? this.index - this.limit() : this.index) * 33 + "px" : "",
				width: this.isMobile ? "100%" : "",
				"z-index": 2000 - this.index
			}
			// getConver: null
		};
	},
	computed: {
		...mapGetters({
			userInfo: "userInfo",
			getConver: "getConver"
		})
	},
	watch: {
		getConver(n) {
			if ($('[data-toggle="tooltip"]').length) {
				let converlength = $('[data-toggle="tooltip"]').length - 1;
				if (this.converlength != converlength) {
					this.converlength = converlength;
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
			console.log(n);
			if (this.getConver != null) {
				this.scrollChat();
			}
			let notify = 0;
			let conver = this.getConver[this.index].content;
			conver
				.slice()
				.reverse()
				.every(c => {
					if (c.ownerId != this.userInfo._id && this.getConver[this.index].hasNew) {
						notify++;
						return true;
					} else {
						return false;
					}
				});
			if (this.getConver[this.index].hasNew) this.notify = notify;
		},
		message(n) {
			if (n == "") {
				this.matchesEmoji = [];
			}
		},
		matchesEmoji() {
			this.scrollChat();
		},
		paths() {
			this.scrollChat();
		}
	},
	methods: {
		cvDate(d) {
			return moment(d).calendar();
		},
		onCLick(k) {
			this.unsub();
			this.$emit("closeChat", k);
			this.$store.dispatch("CLOSE_CHAT", k);
		},
		minimizeChat(k) {
			this.minimize = !this.minimize;
		},
		selectEmoji(emoji) {
			document.getElementById("chatInput__" + this.index).innerHTML += twemoji.parse(twemoji.convert.fromCodePoint(emoji.unified));
			this.emojiPicker = false;
			this.setCaret();
		},
		searchEmoji(e) {
			this.message = document.getElementById("chatInput__" + this.index).innerText;
			if ((this.message.length > 2 && e.keyCode == 32) || e.keyCode == 13) {
				this.emo = this.message.match(this.emojiRegex);
				let a = this.emo ? this.emo[this.emo.length - 1].substr(1) : "";
				if (a.length > 1) {
					this.matchesEmoji = emojiIndex.search(a).map(o => o);
					this.replaceEmoji();
				}
			}
		},
		replaceEmoji(emoji) {
			let input = document.getElementById("chatInput__" + this.index);
			if (emoji) {
				this.message = input.innerHTML;
				let a = twemoji.parse(twemoji.convert.fromCodePoint(emoji.unified));
				input.innerHTML = this.message.replace(this.emo, a + '<div style="display: none">' + emoji.colons + "</div>");
				this.setCaret();
				this.matchesEmoji = [];
				this.emo = [];
			} else if (this.matchesEmoji.length) {
				this.message = input.innerHTML;
				let a = twemoji.parse(twemoji.convert.fromCodePoint(this.matchesEmoji[0].unified));
				input.innerHTML = this.message.replace(this.emo, a + '<div style="display: none">' + this.matchesEmoji[0].colons + "</div>");
				this.setCaret();
				this.matchesEmoji = [];
				this.emo = [];
			}
		},
		dropImage(e) {
			e.preventDefault();
			let dt = e.dataTransfer;
			let files = dt.files;
			if (files.length) {
				if (files.length >= this.limitFiles) alert("Limit" + this.limitFiles + "files");
				for (let i = 0; i < files.length; i++) {
					if (files[i].type != "image/jpeg" && files[i].type != "image/png") {
						let path = this.getConver[this.index].groupId + "/" + Date.now() + "_" + files[i].name;
						this.canSendMessage = false;
						this.hasFile = true;
						this.filePaths.push(path);
						this.realFile.push(files[i]);
						// this.uploadFile(files[i], path, id);
					} else if (files[i].type == "image/jpeg" || files[i].type == "image/png") {
						this.canSendMessage = false;
						this.hasImage = true;
						let path = this.getConver[this.index].groupId + "/" + Date.now() + "_" + files[i].name;
						this.paths.push(path);
						this.images.push(window.URL.createObjectURL(files[i]));
						this.realImage.push(files[i]);
						// this.uploadImage(files[i], path, id);
					}
				}
			}
			this.dragLeave(e);
		},
		uploadFile(file, path, id) {
			this.$store.dispatch(FILE_UPLOAD, {
				file: file,
				path: path,
				id: id
			});
			let interval = setInterval(() => {
				this.files = this.$store.state.chat.files[id];
				let count = this.$store.state.chat.fileCount;
				if (this.files.toString() == this.filePaths.toString() && count == this.filePaths.length) {
					clearInterval(interval);
					this.canSendMessage = true;
				}
				console.log(this.files);
			}, 200);
		},
		pasteImage(e) {
			let id = this.getConver[this.index].id;
			let file = e.clipboardData.files;
			if (file.length) {
				if (this.images.length > 7) {
					return;
				}
				this.canSendMessage = false;
				this.hasImage = true;
				let path = this.getConver[this.index].groupId + "/" + Date.now() + file[0].name;
				this.paths.push(path);
				this.images.push(window.URL.createObjectURL(file[0]));
				this.realImage.push(file[0]);
				this.$forceUpdate();
				// this.uploadImage(file[0], path, id);
			} else {
				return;
			}
			e.preventDefault();
			let text = (e.originalEvent || e).clipboardData.getData("text/plain");
			document.execCommand("insertHTML", false, text);
		},
		uploadImage(file, path, id) {
			// this.$store.dispatch(UPLOAD_IMAGE_TO_CHAT, {
			// 	file: file,
			// 	path: path,
			// 	id: id
			// });
			let interval = setInterval(() => {
				let count = this.$store.state.chat.fileCount;
				this.images = this.$store.state.chat.images[id];
				if (this.images.toString() == this.paths.toString() && count == this.paths.length) {
					clearInterval(interval);
					this.canSendMessage = true;
				}
				console.log(this.images);
			}, 200);
		},
		removeImage(k) {
			// this.$store.dispatch(REMOVE_UPLOAD_IMAGE, {
			// 	amount: 1,
			// 	index: k,
			// 	path: this.paths[k],
			// 	id: this.getConver[this.index].id
			// });
			this.images.splice(k, 1);
			this.paths.splice(k, 1);
			if (this.images.length == 0) this.hasImage = false;
		},
		removeFile(k) {
			// this.$store.dispatch(REMOVE_UPLOAD_FILE, {
			// 	amount: 1,
			// 	index: k,
			// 	path: this.filePaths[k],
			// 	id: this.getConver[this.index].id
			// });
			// this.files.splice(k, 1);
			this.filePaths.splice(k, 1);
			this.realFile.splice(k, 1);
			if (this.files.length == 0) this.hasFile = false;
		},
		show(image, images) {
			this.$modal.show(
				{
					template: `<div><div><img id="imageShow" src="${image}" style="width: 100%"/><button class="close" @click="$emit('close')" style="position: absolute;right: 20px;top: 10px;">&times;</button></div>
											<div style="background-color: transparent;" class="d-flex justify-content-center mt-2">
												<div v-for="image in images" :style="{backgroundImage: 'url('+image+')'}" @click="showImage(image)" :class="{active: active == image}" id="thumbnailImage" class="border border-dark"></div></div></div>`,
					props: {
						images: Array
					},
					data() {
						return {
							active: image
						};
					},
					methods: {
						showImage(img) {
							if (document.getElementById("imageShow").src != img) document.getElementById("imageShow").src = img;
							this.active = img;
						}
					},
					mounted() {
						document.getElementsByTagName("body")[0].style.overflow = "hidden";
					},
					destroyed() {
						document.getElementsByTagName("body")[0].style.overflow = "";
					}
				},
				{ images },
				{
					width: "70%",
					height: "auto",
					style: { "z-index": 9000 }
				},
				{
					closed: this.hide
				}
			);
		},
		hide() {
			this.$modal.hide("view-post");
		},
		sendMessage(e) {
			let id = this.getConver[this.index].id;
			// let retry = 0;
			if (this.emo) this.searchEmoji(e);

			if (this.hasFile) {
				let fileLength = this.filePaths.length - 1;
				for (let i = 0; i <= fileLength; i++) {
					this.uploadFile(this.realFile[i], this.filePaths[i], id);
				}
			}

			if (this.hasImage) {
				let imageLength = this.paths.length - 1;
				for (let i = 0; i <= imageLength; i++) {
					this.uploadFile(this.realImage[i], this.paths[i], id);
				}
			}

			this.message = document.getElementById("chatInput__" + this.index).textContent;
			// let interval = setInterval(() => {
			if ((this.message.length || this.images.length || this.files.length) && this.canSendMessage) {
				let m = {
					membersId: this.userInfo.id + this.user.id,
					message: this.message,
					owner: this.userInfo.name,
					ownerId: this.userInfo._id,
					_id: this.getConver[this.index].id,
					userImg: this.userInfo.imgURL,
					img: this.images,
					file: this.files
				};
				return console.log(m);
				this.$store.dispatch(SEND_MESSAGE, m);
				document.getElementById("chatInput__" + this.index).innerHTML = "";
				this.images = [];
				this.files = [];
				this.paths = [];
				this.filePaths = [];
				this.hasImage = false;
				this.hasFile = false;
				this.realFile = [];
				this.realImage = [];
				setTimeout(() => {
					this.$forceUpdate();
					this.scrollChat();
				}, 100);
				// if (!this.paths.length) {
				// 	this.$store.dispatch(REMOVE_UPLOAD_IMAGE, {
				// 		amount: 0,
				// 		id: this.getConver[this.index].id
				// 	});
				// }
				// if (!this.filePaths.length) {
				// 	this.$store.dispatch(REMOVE_UPLOAD_FILE, {
				// 		amount: 0,
				// 		id: this.getConver[this.index].id
				// 	});
				// }
				// clearInterval(interval);
			} else {
				console.log("Cant send messsage");
			}
			// retry++;
			// if (retry == 10) {
			// 	clearInterval(interval);
			// 	console.log("Timeout");
			// }
			// }, 200);
		},
		scrollChat() {
			window.setTimeout(() => {
				let el = document.getElementById(this.user._id);
				el.scrollTop = el.scrollHeight;
			}, 50);
		},
		setCaret() {
			var el = document.getElementById("chatInput__" + this.index);
			var range = document.createRange();
			var sel = window.getSelection();
			range.setStart(el.childNodes[el.childNodes.length - 1], el.childNodes[el.childNodes.length - 1].length);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			el.focus();
		},
		dragEnter(e) {
			document.getElementById("dropzone").classList.add("border-primary");
		},
		dragLeave(e) {
			document.getElementById("dropzone").classList.remove("border-primary");
		},
		checkImageLink(link) {
			let a = link.indexOf(".jpg");
			let b = link.indexOf(".png");
			let c = link.indexOf(".jpeg");
			if (a > -1 || b > -1 || c > -1) {
				return true;
			} else return false;
		}
	},
	mounted() {
		this.$store.dispatch(GET_CONVERSATION, this.userInfo.id + this.user.id);
		setTimeout(() => {
			this.unsub = this.$store.state.chat.unsub[this.index];
			$('[data-toggle="tooltip"]').tooltip();
			// this.$forceUpdate();
		}, 1000);
		this.setCaret();

		document.addEventListener("click", evt => {
			const flyoutElement = document.getElementById("chatbox__" + this.index);
			let targetElement = evt.target;
			do {
				if (targetElement == flyoutElement) {
					this.isFocus = true;
					return;
				}
				targetElement = targetElement.parentNode;
			} while (targetElement);
			this.isFocus = false;
		});
	}
};
</script>

<style>
.minimize {
	top: 18em;
	display: none;
}
.chat-wrapper:first-child .other-chat {
	border-top-left-radius: 16px;
}
.chat-wrapper:last-child .other-chat {
	border-bottom-left-radius: 16px;
}
.other-chat {
	border-radius: 4px 16px 16px 4px;
}
.my-chat {
	border-radius: 16px 4px 4px 16px;
}
.chat-wrapper:last-child .my-chat {
	border-bottom-right-radius: 16px;
}
.chat-wrapper:first-child .my-chat {
	border-top-right-radius: 16px;
}
.minimize {
	height: 0 !important;
	padding: 0;
}
.chat-box {
	position: fixed !important;
	bottom: 0;
	z-index: 2000;
	max-width: 300px;
	width: 300px;
	box-sizing: border-box;
	max-height: calc(100% - 56px);
}

.chat-box::-webkit-scrollbar {
	width: 10px;
}

.chat-box::-webkit-scrollbar-thumb {
	background: #666;
	border-radius: 20px;
}

.chat-box::-webkit-scrollbar-track {
	background: #ddd;
	border-radius: 20px;
}

.form-control:focus {
	box-shadow: none;
}

.notify-count {
	border-radius: 50%;
	height: 15px;
	width: 15px;
	position: absolute;
	line-height: 15px;
	font-size: 0.7em !important;
}

.chat-header:hover {
	background-color: #007bff !important;
}
.chat-header:hover a {
	color: white !important;
}

.list-inline-item .emoji {
	height: 1.5em !important;
}

.emoji-btn {
	background-image: url("https://twemoji.maxcdn.com/2/72x72/1f600.png");
	background-size: 80%;
	background-repeat: no-repeat;
	background-position: 0 50%;
	height: 30px;
	width: 30px;
	cursor: pointer;
	z-index: 100;
	display: block;
}

.emoji-suggest {
	// position: absolute;
	// top: -150px;
	height: 95px;
	overflow: auto;
	width: 100%;
}

.uploaded-image {
	height: 50px;
	width: 22%;
	border: 2px solid;
	background-size: cover;
	background-position: center;
	box-sizing: border-box;
	margin: 2px;
}

.uploaded-file {
	overflow-y: auto;
	overflow-x: hidden;
}
.image-message {
	height: 4em;
	width: 4em;
	background-position: center;
	background-size: cover;
}

.view-image {
	width: 100%;
}

.close.ml-3 {
	position: absolute;
	right: 20px;
	top: 10px;
}

.v--modal-box.v--modal {
	background-color: transparent;
	max-height: 100%;
}

#thumbnailImage {
	width: 150px;
	height: 100px;
	background-size: cover;
	box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.7);
}
#thumbnailImage:hover {
	border: 1px solid black;
	box-shadow: none;
}

#thumbnailImage.active {
	box-shadow: none;
	border: 1px solid white;
}

[contenteditable]:focus {
	outline: 0px solid transparent;
}
</style>

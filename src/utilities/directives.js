import Vue from "vue";
import { emojiIndex } from "emoji-mart-vue";
import db from "../database/firestore";

const EMOJI = "emoji";
const POST = "post";
const USER = "user";

// Vue.directive(EMOJI, {
// 	inserted(el) {
// 		const ranges = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D]|\s)/g;

// 		const removeEmoji = str => str.replace(new RegExp(ranges, "g"), "");

// 		const isOnlyEmojis = str => !removeEmoji(str).length;
// 		let value = el.innerHTML;
// 		let regex = /:\w{2,}:/g; // shortcode, eg: :smile:
// 		let regex2 = /(:\w+:|<[/\\]?3|[\\\D|*$][-^]?[:;=]|[:;=B8][-^]?[3DOPp@$*\\)(/|])(?=\s|[!.?]|$)/g; // emoticon :)
// 		let regex3 = /:\W{1,3}/g;
// 		let a = value.match(regex);
// 		let b = value.match(regex2);
// 		let c = value.match(regex3);

// 		if (a != null) {
// 			a.forEach(v => {
// 				emojiIndex.search(v.substr(1, v.length - 2)).map(o => {
// 					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
// 				});
// 			});
// 		}
// 		if (b != null) {
// 			b.forEach(v => {
// 				emojiIndex.search(v.trim()).map(o => {
// 					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
// 				});
// 			});
// 		}
// 		if (c != null) {
// 			c.forEach(v => {
// 				emojiIndex.search(v.trim()).map(o => {
// 					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
// 				});
// 			});
// 		}
// 		isOnlyEmojis(value) ? "" : el.classList.add("message");
// 		el.innerHTML = twemoji.parse(value, {
// 			folder: "svg",
// 			ext: ".svg"
// 		});
// 	},
// 	update(binding) {
// 		console.log(binding);
// 	}
// });

Vue.directive(EMOJI, {
	bind(el, binding) {
		const ranges = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D]|\s)/g;

		const removeEmoji = str => str.replace(new RegExp(ranges, "g"), "");

		const isOnlyEmojis = str => !removeEmoji(str).length;
		let value = binding.value;
		let regex = /:\w{2,}:/g; // shortcode, eg: :smile:
		let regex2 = /(:\w+:|<[/\\]?3|[\\\D|*$][-^]?[:;=]|[:;=B8][-^]?[3DOPp@$*\\)(/|])(?=\s|[!.?]|$)/g; // emoticon :)
		let regex3 = /:\W{1,}/g;
		let a = value.match(regex);
		let b = value.match(regex2);
		let c = value.match(regex3);

		if (a != null) {
			a.forEach(v => {
				emojiIndex.search(v.substr(1, v.length - 2)).map(o => {
					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
				});
			});
		}
		if (b != null) {
			b.forEach(v => {
				emojiIndex.search(v.trim()).map(o => {
					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
				});
			});
		}
		if (c != null) {
			c.forEach(v => {
				emojiIndex.search(v.trim()).map(o => {
					value = value.replace(v, twemoji.convert.fromCodePoint(o.unified));
				});
			});
		}
		isOnlyEmojis(value) ? "" : el.classList.add("message");
		el.innerHTML = twemoji.parse(value, {
			folder: "svg",
			ext: ".svg"
		});
	},
	update(el, binding) {
		if (el.getAttribute("contenteditable")) console.log(binding);
	}
});
Vue.directive(POST, {
	inserted(el) {
		let postId = el.innerText;
		db.collection("POSTS")
			.where("id", "==", postId.trim())
			.get()
			.then(doc => {
				console.log(doc.docs[0].data());
				let post = doc.docs[0].data();
				el.innerText = post.title;
			});
	}
});

Vue.directive(USER, {
	inserted(el) {
		let postId = el.innerText;
		db.collection("users")
			.where("id", "==", postId.trim())
			.get()
			.then(doc => {
				console.log(doc.docs[0].data());
				let user = doc.docs[0].data();
				el.innerText = user.name + ` <small class="text-muted">${user.email}</small>`;
			});
	}
});

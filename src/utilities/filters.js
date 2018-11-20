import Vue from "vue";
import { emojiIndex } from "emoji-mart-vue";

Vue.filter("Emoji", function(value, id) {
	let regex = /:\w{2,}:/g; // shortcode, eg: :smile:
	let regex2 = /(:\w+:|<[/\\]?3|[\\\D|*$][-^]?[:;=]|[:;=B8][-^]?[3DOPp@$*\\)(/|])(?=\s|[!.?]|$)/g; // emoticon :)

	if (!value) return "";
	let a = value.match(regex);
	let b = value.match(regex2);
	if (a != null) {
		a.forEach(v => {
			emojiIndex.search(v.substr(1, v.length - 2)).map(o => {
				value = value.replace(v, o.native);
			});
		});
	}
	if (b != null) {
		b.forEach(v => {
			emojiIndex.search(v.trim()).map(o => {
				value = value.replace(v, o.native);
			});
		});
	}
	return value;
});

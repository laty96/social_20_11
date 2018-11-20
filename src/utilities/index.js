import moment from "moment";
import m from "moment-shortformat";

export function createNotify(d, name) {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	} else if (Notification.permission === "granted") {
		const notification = new Notification(name, {
			body: d.body,
			icon: d.icon
		});
		setTimeout(notification.close.bind(notification), 4000);
		notification.onclick = function() {
			window.focus("https://4x2939pp80.codesandbox.io/#/");
		};
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission();
	}
}

export function convertDate(d) {
	return isMobile.any() ? moment(d).short() : moment(d).fromNow();
}

export function convertShortDate(d, b = false) {
	return moment(d).short(b);
}

export function calendarTime(d) {
	return moment(d).calendar();
}
export function randomID() {
	return "_" + (Math.random() * Date.now()).toString(36).replace(".", "");
}

export function sortCmt(arr, field, order = true) {
	return arr.sort(function(a, b) {
		if (field == "like") return b.like.length - a.like.length;
		if (order) {
			return new Date(b[field]) - new Date(a[field]);
		} else {
			return new Date(a[field]) - new Date(b[field]);
		}
	});
}

export const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	}
};

export function swipedetect(el, callback) {
	var touchsurface = el,
		swipedir,
		startX,
		startY,
		distX,
		distY,
		threshold = 100, //required min distance traveled to be considered swipe
		restraint = 100, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 300, // maximum time allowed to travel that distance
		elapsedTime,
		startTime,
		handleswipe = callback || function(swipedir) {};

	touchsurface.addEventListener(
		"touchstart",
		function(e) {
			var touchobj = e.changedTouches[0];
			swipedir = "none";
			var dist = 0;
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime(); // record time when finger first makes contact with surface
			// e.preventDefault();
		},
		false
	);

	// touchsurface.addEventListener(
	// 	"touchmove",
	// 	function(e) {
	// 		e.preventDefault(); // prevent scrolling when inside DIV
	// 	},
	// 	false
	// );

	touchsurface.addEventListener(
		"touchend",
		function(e) {
			var touchobj = e.changedTouches[0];
			distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
			distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
			elapsedTime = new Date().getTime() - startTime; // get time elapsed
			if (elapsedTime <= allowedTime) {
				// first condition for awipe met
				if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
					// 2nd condition for horizontal swipe met
					swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
				} else if (
					Math.abs(distY) >= threshold &&
					Math.abs(distX) <= restraint
				) {
					// 2nd condition for vertical swipe met
					swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
				}
			}
			handleswipe(swipedir);
		},
		false
	);
}

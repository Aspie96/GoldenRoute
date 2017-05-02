// GoldenRoute
// (c) 2016 - 2017, Valentino Giudice, https://github.com/Aspie96/GoldenRoute
// Licensed under the MIT license: https://github.com/Aspie96/GoldenRoute/blob/master/LICENSE

var GoldenRoute = (function() {
	if(window.history && window.history.pushState) {
		var retVal = {};

		var routes = [];

		var onRoutingHandler;
		var onRoutedHandler;

		function getRouteAndParams(url) {
			url = url.split("#")[0];
			var parts = url.split("?");
			var path = parts[0].replace(/[\\\/]+/g, "/");
			var route = null;
			var params = {};
			for(var i = 0; i < routes.length && !route; i++) {
				var match = path.match(routes[i].pattern);
				if(match) {
					route = routes[i];
					for(var i = 0; i < route.params.length; i++) {
						params[route.params[i]] = decodeURIComponent(match[i + 1]);
					}
				}
			}
			if(route) {
				var query = {};
				if(parts[1]) {
					parts = parts[1].split("&");
					for(var i = 0; i < parts.length; i++) {
						var pair = parts[i].split("=");
						if(pair[1]) {
							query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, " "));
						} else {
							query[decodeURIComponent(pair[0])] = true;
						}
					}
				}
				return {
					params: params,
					query: query,
					route: route
				};
			} else {
				return null;
			}
		}

		function routeTo(route, pushState) {
			var routeNpars = getRouteAndParams(route);
			if(routeNpars) {
				if(onRoutingHandler && onRoutingHandler() === false) {
					return true;
				}
				routeNpars.route.routeFunc(routeNpars.params, routeNpars.query, function(title, cancel) {
					if(!cancel) {
						document.title = title;
						document.body.scrollTop = document.documentElement.scrollTop = 0;
						document.body.scrollLeft = document.documentElement.scrollLeft = 0;
						if(pushState) {
							if((location.origin || (location.protocol + "//" + location.host)) + route == location.href) {
								history.replaceState(null, title, route);
							} else {
								history.pushState(null, title, route);
							}
						}
						if(onRoutedHandler) {
							onRoutedHandler();
						}
					}
				});
				return true;
			}
			return false;
		}

		retVal.addRoute = function(url, routeFunc) {
			var route = {};
			var parts = url.split("/");
			var pattern = "^";
			route.params = [];
			for(var i = 0; i < parts.length; i++) {
				if(parts[i].indexOf(":") == 0) {
					route.params.push(parts[i].slice(1));
					parts[i] = "([a-zA-Z0-9\-_]+)";
				} else {
					parts[i] = parts[i];
				}
			}
			pattern += parts.join("/");
			pattern += "$";
			route.pattern = new RegExp(pattern);
			route.routeFunc = routeFunc;
			routes.push(route);
		};

		retVal.start = function() {
			document.addEventListener("click", function(e) {
				var href;
				var target;
				if(e.target.tagName == "A") {
					href = e.target.getAttribute("href");
					target = e.target.getAttribute("target");
				} else if(e.target.parentNode.tagName == "A") {
					href = e.target.parentNode.getAttribute("href");
					target = e.target.parentNode.getAttribute("target");
				}
				if(href) {
					if(target == "_blank" || (retVal.externalInBlank && /^(http:|https:|)\/\//i.test(href) && target != "_self")) {
						e.preventDefault();
						var wnd = window.open(href, "_blank");
						wnd.opener = null;
						e.target.blur();
					} else if(/^[\\\/](?![\\\/])/.test(href)) {
						if(routeTo(href, true)) {
							e.preventDefault();
							e.target.blur();
						}
					}
				}
			}, false);
			addEventListener("popstate", function(e) {
				if(!routeTo(location.pathname + location.search, false)) {
					location.reload();
				}
			});
		};

		retVal.routeTo = function(route) {
			if(!routeTo(route, true)) {
				location.href = route;
			}
		};

		retVal.onRouting = function(handler) {
			onRoutingHandler = handler;
		}
		retVal.onRouted = function(handler) {
			onRoutedHandler = handler;
		}

		retVal.externalInBlank = true;

		return retVal;
	}
	return {
		addRoute: function() { },
		start: function() { },
		routeTo: function(route) {
			location.href = route;
		},
		onRouting: function() { },
		onRouted: function() { }
	};
})();

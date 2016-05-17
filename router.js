// GoldenRoute
// 2016, Valentino Giudice, https://github.com/Aspie96/GoldenRoute
// Licensed under the MIT license: https://github.com/Aspie96/GoldenRoute/blob/master/LICENSE

var GoldenRoute = (function() {
	if(window.history && window.history.pushState) {
		var retVal = {};

		var routes = [];

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
							query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
						} else {
							query[decodeURIComponent(pair[0])] = null;
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
				routeNpars.route.routeFunc(routeNpars.params, routeNpars.query, function(title) {
					if(pushState) {
						history.pushState(null, title, route);
					}
					document.title = title;
				});
			}
			return !!routeNpars;
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
				if(e.target.tagName == "A") {
					var href = e.target.getAttribute("href");
					if(/^[\\\/](?![\\\/])/.test(href)) {
						if(routeTo(href, true)) {
							e.preventDefault();
						}
					}
				}
			}, false);
			addEventListener("popstate", function(e) {
				if(!routeTo(location.pathname, false)) {
					location.reload();
				}
			});
		};

		retVal.routeTo = function(route) {
			if(!routeTo(route, true)) {
				location.href = route;
			}
		};

		return retVal;
	}
	return {
		addRoute: function() { },
		start: function() { },
		routeTo: function(route) {
			location.href = route;
		}
	};
})();

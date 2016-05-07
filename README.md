# GoldenRoute
GoldenRoute is a simple router written in native JavaScript, which doesn't use any framework or library.
Its code is contained in `router.js`.

## What it offers
GoldenRoute is a very simple but still very versatile client-side routing tool.

GoldenRoute:
* Is very small. A hundred lines of code.
* Has no external dependencies.
* Does not use fragments.
* Does use `window.history.pushState`.
* Supports route parameters.
* Works on normal HTML links (such as `<a href="/route1">link</a>`), without any need to modify their code.
* Does not work, but also doesn't cause any problem, in case of browser-incompatibility (the liks will just work normally).
* Is easy to use.

## How to use
The router must be included in your HTM file like that:
```html
<script type="text/javascript" src="router.min.js"></script>
```

This provides the `GoldenRoute` object, which contains the following methods:
* `GoldenRoute.addRoute(url, routeFunc)`: This method is called to specify a new route.
* `GoldenRoute.start()`: This method should be called when the page has been loaded and the routes are set (though, it will still works if it is called in any other moment, even before the routes are set). It makes the routing effective.

### How to add a route
In order to add a route you must write:
```javascript
GoldenRoute.addRoute("/route", function(params, query, callback) {
	// The content of the page is refreshed.
	callback(title);
});
```

The url of a route must always start with a single forward slash (`/`).

The `routeFunc` function must refresh the content of the page and then call the `callback` function, giving it the new page title as a parameter.

The `query` params will contain, the content of the query string, as an associative array.

### Parameterized routes
The `routeFunc` function also receives a `params` parameter.

That is because one can create routes like this:

```javascript
GoldenRoute.addRoute("/user/:id", function(params, query, callback) {
	console.log("User ID: " + params.id);
	// The content of the page is refreshed.
	callback(title);
});
```

If such a route is created, resources like `/user/9` will be directed to that route.

A route is also allowed to have multiple parameters:
```javascript
GoldenRoute.addRoute("/threads/:threadId/:postId", function(params, query, callback) {
	// This route identifies a single post of a thread in a forum.
	callback(title);
});
```

### Create a link
In order for a link to be routed properly, it only has to refer to a relative URL starting with `/`, which has been added to `GoldenRoute` through `addRoute`:
```html
<a href="/user/9">Ninth user</a>
```

This will also work for links dynamically added to the page through JavaScript, even after the `start` method has even been called, or in any moment at all.

## Small example
This is a small working example of routing through JavaScript with GoldenRoute.

Of course, only the client-side part is provided.
```html
<html>
	<head>
		<meta charset="UTF-8" />
		<title>GoldenRoute | demo</title>
		<script type="text/javascript" src="router.js"></script>
		<script type="text/javascript">
			onload = function() {
				var contentDiv = document.getElementById("content");	// All routes are going to update the main content of the page.
				GoldenRoute.addRoute("/plant/:id", function(params, query, callback) {
					contentDiv.innerHTML = "<h2>You selected the " + params.id + "th plant.</h2>";
					callback("Some plant");
				});
				GoldenRoute.addRoute("/myPage", function(params, query, callback) {
					contentDiv.innerHTML = "<p>This is just a page.</p>";
					callback("Page title");
				});
				GoldenRoute.start();
			}
		</script>
	</head>
	<body>
		<a href="/plant/9">link 1</a>
		<a href="/plant/10">link 1</a>
		<a href="/myPage">link 3</a>
		<div id="content"></id>
	</body>
</html>
```

## Server-side and templating tools
A very important thing to take into consideration when using GoldenRoute is that every route that is served by JavaScript on the client side **must** also be served by the server through dynamic pages or prerendering (as an alternative, the server might always return the same page which is filled client-side through JavaScript after loading).

If that cannot be the case, then client side routing through GoldenRoute should not even be considered.

There are many reasons to why that is, but, just as an example, think about what would happen if that weren't the case and the user decided to refresh the page. They'd get a 404 error and it is not good at all.

The prerendered page must look identical to the client-side generated page.

The best way to do that with very little code is using templating tools, such as [doT](https://github.com/olado/doT) or [Pug](https://github.com/pugjs/pug). Those tool can dynamically generate the same code both client-side and server-side using Node.js.

doT is lighter for Node.js applications, whileas Pug (previously named *Jade*) is also available for [PHP](https://github.com/kylekatarnls/jade-php). There are also many other alternatives you can chose from.

## License
GoldenRoute is licensed by [Valentino Giudice](https://twitter.com/Aspie96) under the MIT license.

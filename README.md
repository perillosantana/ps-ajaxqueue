# Perillo Santana - jQuery Ajax Queue

**Simple request example**

```javascript
$.ajax({
	url: "//api.ipify.org?format=jsonp", 
	dataType: "jsonp"
}).done(function(data) {
	console.log(data);
});
```
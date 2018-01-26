# PS - jQuery Ajax Queue

Simple Ajax request, avoiding repeated requests

## Installation

`npm install ps-ajaxqueue -D`

## Usage Javascript

```javascript
let $PS = require('ps-ajaxqueue');

$PS.ajaxQueue({
	url: "https://api.ipify.org/?format=jsonp",
	dataType: "jsonp",
	clearQueueDelay: null
}).done(function (data) {
	console.log(data);
});
```

## Usage Javascript

```typescript
import { ajaxqueue } from 'ps-ajaxqueue';

const $PSAjax = ajaxqueue;

$PSAjax({
	url: "https://api.ipify.org/?format=jsonp",
	dataType: "jsonp",
	clearQueueDelay: null
}).done(function (data) {
	console.log(data);
});
```

**clearQueueDelay: null** // Defines the time in milliseconds where the request data will be cached. If "null" is passed the data will never be cleared
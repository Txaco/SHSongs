const APP = (() => {

	// SecondHandSongs API Wrapper
	const SHS = {};
		SHS.endpoint = 'https://secondhandsongs.com/'; // Common endpoint URI
		SHS.search_params = {}; // Search parameters - Common & specific for all entities, plus "get" method for output (as a string)
			SHS.search_params.common = ['&page=0', '&pageSize=100', '&format=json']; // Common
			SHS.search_params.work = ['?title=', '&credits=']; // Work entity
			SHS.search_params.performance = ['?title=', '&performer=', '&date=']; // Performance entity
			SHS.search_params.artist = ['?commonName=']; // Artist entity
			SHS.search_params.object = ['?caption=']; // Object entity (generic, gives results for all entities)
			// Method - Get request parameters as a string
			SHS.search_params.get_string = function(target, input, options) {
				let parameters = this[target][0] + input; // Start adding first target entity parameter (required) with value = input value
				// Check options and add new parameters (if supported) with value = option value
				if(options) {
					if(target === 'work' && options.credits) parameters += this[target][1] + options.credits; // Work supports "credits"
					// Performance supports "performer" and "date"
					else if(target === 'performance') {
						if(options.performer) parameters += this[target][1] + options.performer;
						if(options.date) parameters += this[target][2] + options.date;
					}
				}
				parameters += this.common.join(''); // Finish adding common parameters
				return parameters; // Output string
			};
		SHS.request_options = {}; // Fetch request options, including headers
			//SHS.request_options.method = 'GET'; // 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE'
			//SHS.request_options.mode = 'no-cors'; // 'cors' | 'no-cors' | 'same-origin'
			//SHS.request_options.credentials = 'include'; // 'omit' | 'same-origin' | 'include'
			//SHS.request_options.referrer = 'client'; // 'no-referrer' | 'client' | '<URL>'
			//SHS.request_options.referrerPolicy = 'origin';
			// 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url'
			// Requets headers		
			//SHS.request_options.headers = new Headers({ 'Accept': 'application/json' });
		// Method - Get search results by entity and input value, with supported options (parameters)
		SHS.search = function(target, input, options) {
			let parameters = this.search_params.get_string(target, input, options); // Get parameters
			let uri = this.endpoint + 'search/' + target + parameters; // Build request URL
			this.fetch_request(uri); // Fetch URL
		};
		// Method - Fetch URL with request options, parse JSON response and LOG. Catch errors.
		SHS.fetch_request = function(uri) {
			// Fetch URL
			fetch(uri, this.request_options).then(r=>r.json()).then(j=>console.log(j));
		};
		// Method - AJAX request with callback function
		SHS.ajax_request = function(uri, callback = this.callback) {
			let req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				if(req.readyState < 4) return;
				if(req.status !== 200) return;
				if(req.readyState === 4) callback(req);
			};
			//req.onerror = function(evt) { console.log(evt); };
			//req.onload = function(evt) { console.log(evt); };
			//req.onloadend = function(evt) { console.log(evt); };
			//req.onloadstart = function(evt) { console.log(evt); };
			req.open('GET', uri, true);
			req.setRequestHeader('Accept', 'application/json');
			//req.setRequestHeader('Content-Type', 'application/json');
			//req.withCredentials = true;
			req.send('');
		}
		SHS.callback = function(req) { console.log(req); };

	SHS.search('object', 'blackbird'); // Search for all entities with this value in primary field

})();

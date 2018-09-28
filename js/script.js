const APP = (() => {
  
  const SHS = {};
  SHS.defaults = { page: 0, pageSize: 100, format: 'json'};
  SHS.endpoint = 'https://secondhandsongs.com/';
	SHS.search_parameters = {
			common: [`&page=${SHS.defaults.page}`, `&pageSize=${SHS.defaults.pageSize}`, `&format=${SHS.defaults.format}`],
			work: [`?title=`, `&credits=`],
			performance: [`?title=`, `&performer=`, `&date=`],
			artist: [`?commonName=`],
			object: [`?caption=`],
			get_parameters(target, input, options) {
				let parameters = this[target][0] + input;
				if(options) {
					if(target === 'work' && options.credits) parameters += this[target][1] + options.credits;
					else if(target === 'performance') {
						if(options.performer) parameters += this[target][1] + options.performer;
						if(options.date) parameters += this[target][2] + options.date;
					}
				}
				parameters += this.common.join('');
				return parameters;
			}
		};
	SHS.search = function(target, input, options) {
		let parameters = this.search_parameters.get_parameters(target, input, options);
		let uri = this.endpoint + 'search/' + target + parameters;
		this.request(uri);
	};
	SHS.request = function(uri) {
		let options = {
			headers: {
				'Accept': 'application/json'
			}
		};
		fetch(uri, options).then(r => r.json()).then(d => console.log(d)).catch(e => console.log(e));
	};

	SHS.search('object', 'blackbird');

})();

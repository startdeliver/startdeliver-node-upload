const request = require('request');
const fs = require('fs');

exports.upload = function (file, opts) {
	opts = opts || {};

	var formData = {};

	if (Buffer.isBuffer(file)) {
		formData.file = Buffer.from(file);
	} else {
		formData.file = fs.createReadStream(file);
	}

	let url = this.settings.apiUrl + 'upload';

	if (opts.public) {
		url += '?public=true';
	}

	return new Promise((resolve, reject) => {

		request.post({
			timeout: opts.timeout || 120 * 1000,
			url: url,
			formData: formData,
			headers: {
				'Authorization': this.settings.apiKey,
				'Content-Type': 'multipart/form-data'
			}
		}, function (err, httpResponse, body) {
			if (err) {
				return reject(err);
			}
			try {
				let out = JSON.parse(body);
				resolve(out);
			} catch (e) {
				resolve(body);
			}
		});

	});


};

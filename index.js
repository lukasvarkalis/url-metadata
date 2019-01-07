const q = require('q')
const axios = require('axios')
const parse = require('./lib/parse')

module.exports = function (url, options) {
  const dfd = q.defer()
  if (!options || typeof options !== 'object') options = {}
  const opts = {
    userAgent: options.userAgent || 'MetadataScraper',
    fromEmail: options.fromEmail || 'example@example.com',
    maxRedirects: options.maxRedirects || 5,
    timeout: options.timeout || 10000,
    descriptionLength: options.descriptionLength || 750,
    ensureSecureImageRequest: options.ensureSecureImageRequest || true,
    sourceMap: options.sourceMap || {},
    encode: options.encode || undefined
  }

  const requestOpts = {
    method: 'get',
    url: url,
    headers: {
      'User-Agent': opts.userAgent,
      'From': opts.fromEmail
    },
    maxRedirects: opts.maxRedirects,
    timeout: opts.timeout,
  };

  axios(requestOpts)
    .then(response => {
      if (response.statusCode && response.statusCode !== 200) {
        return dfd.reject({ Error: 'response code ' + response.statusCode });
      }

      if (response.statusCode && response.statusCode === 200) {
        return dfd.resolve(parse(url, response.data, opts));
      }
    })
    .catch(err => {
      return dfd.reject(err);
    });

  return dfd.promise
}

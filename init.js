/**
 * Created by Trevor on 7/9/17.
 */

var cheerio = require('cheerio');
var request = require('request');

request('https://news.ycombinator.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        console.log(html);
    }
});
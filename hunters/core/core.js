/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');


module.exports = {

    buildOptions: function(url){
        return {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
    }

};
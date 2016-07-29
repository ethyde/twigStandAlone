/* ==========================================================================
    WEBPACK CONFIG
   ========================================================================== */

/*

http://putaindecode.io/fr/articles/js/webpack/premier-exemple/

*/

var path = require("path");
var webpack = require("webpack");
var postcssImport = require('postcss-import');

module.exports = {
    entry: './assets/main.js',
    output: {
        path: path.join(__dirname, "build"),
        filename: 'bundle.js'
    },
    loaders: [
        /*{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference 
            query: {
                presets: ['es2015']
            }
        },*/
        {
            test:   /\.css$/,
            loader: "style-loader!css-loader?modules&importLoaders=1!postcss-loader"
        }
    ],
    postcss: function (webpack) {
        return [
            require('postcss-import')({ addDependencyTo: webpack }),
            require('autoprefixer')({ browsers: ['last 2 versions'] })
        ];
    }
};
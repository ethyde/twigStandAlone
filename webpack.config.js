/* ==========================================================================
    WEBPACK CONFIG
   ========================================================================== */

/* Load modules */
var path = require('path');
var fs = require('fs');

/* Load plugins */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

/* -------------------------------------------------------------------------- */
/* Paths */
var context = __dirname;
var componentPath = context + '/Component';
var layoutPath = context + '/Layout';
var globalPath = context + '/global-asset';
var globalSourcePath = globalPath + '/source';
var scriptPath = globalSourcePath + '/js';
var stylePath = globalSourcePath + '/css';
var fontPath = globalSourcePath + '/font';
var svgPath = fontPath + '/svg';

/**
 * -- Proxy for BrowserSync config --
 * When using PHP built-in server
 * > php -S host:port
 * use 127.0.0.1:port instead of localhost:port
 * see https://github.com/BrowserSync/browser-sync/issues/335
 */
var proxy = '127.0.0.1:8000';
// var proxy = 'localhost:8000';

// multiple extract instances
var extractCSS = new ExtractTextPlugin('[name].css');
var extractIconFont = new ExtractTextPlugin('[name]/icons.css');

/* -------------------------------------------------------------------------- */
/* Utilities */

/* -------------------------------------------------------------------------- */
/**
 * For each entry, the key is the chunk [name] used in output filename (can be a path)
 * The value is the source filename (without extension)
 * It seems entries need to be prefixed with `./` or webpack won't resolve and throw `module not found`
 *
 * Example entry : 'path/to/output/directory' : './sourcefile'
 */

/**
 * Automagically build the entry object
 */
var entry = {};
var components = fs.readdirSync(componentPath);
var layouts = fs.readdirSync(layoutPath);
var fn = ''; // filename
var i;

entry[globalPath + '/dist/app'] = 'app.js';

for (i = 0; fn = components[i]; i++) {
    entry[path.join(componentPath, fn, '/dist/', fn)] = path.join(fn, '/source', fn);
}

for (i = 0; fn = layouts[i]; i++) {
    entry[path.join(layoutPath, fn, '/dist/', fn)] = path.join(fn, '/source', fn);
}
// console.log(entry);
/* -------------------------------------------------------------------------- */
module.exports = {
    context: context,
    entry: entry,
    output: {
        // path: outputPath,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/, // pcss
                loader: extractCSS.extract('style', 'css!postcss')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.font\.(js|json)$/,
                loader: extractIconFont.extract('style', ['css', 'fontgen'])
            }
        ]
    },
    plugins: [
        extractCSS, // output a separate css bundle
        extractIconFont,

        new BrowserSyncPlugin({
            // proxy the local server name through BrowserSync
            proxy: proxy,
            // tunnel: true,
            files: [
                componentPath + '/**/*.js',
                componentPath + '/**/*.css',
                layoutPath + '/**/*.js',
                layoutPath + '/**/*.css'
            ]
        })
    ],
    resolve: {
        /* Directories (absolute paths) which contains the modules (scripts and styles)
         * used to resolve sources from the `entry` config (above)
         * and `require()` calls from inside module definitions */
        root: [
            componentPath,
            layoutPath,
            scriptPath,
            stylePath,
            fontPath
        ]
    },
    postcss: function (webpack) {
        return [
            require('postcss-import')({ addDependencyTo: webpack }),
            require('postcss-cssnext')(),
            // require('autoprefixer')
        ];
    }
};

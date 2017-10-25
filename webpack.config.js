const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSync = require('browser-sync-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		port: 9000,
		inline: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['latest', 'stage-0']
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({ // extract stylesheets into separate file
					fallback: 'style-loader', // inject CSS into page via <style>
					use: [
						{ loader: 'css-loader' }, // translate CSS into CommonJS modules
						{ 
							loader: 'postcss-loader', // postcss loader
							options: {
								plugins: function() {
									return [ require('autoprefixer') ] // run autoprefixer
								}
							}
						}
					]
				})
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({ // extract stylesheets into separate file
					fallback: 'style-loader', // inject CSS into page via <style>
					use: [
						{ loader: 'css-loader' }, // translate CSS into CommonJS modules
						{ 
							loader: 'postcss-loader', // postcss loader
							options: {
								plugins: function() {
									return [ require('autoprefixer') ] // run autoprefixer
								}
							}
						},
						{ loader: 'sass-loader' }
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('style.css'), // run extract-text-webpack-plugin 
		new BrowserSync({
			host: 'localhost',	// browse to http://localhost/9001
			port: 9001,			// 

			proxy: 'http://localhost:9000', // proxying Webpack Dev Server (which should be serving on http://localhost:9000)
			
			files: [{
				match: [ '**/*.html' ], 												// let BrowserSync only handle on-change .html reloading 
				fn: function(event, file) {												//
					if (event === "change") {											//
						const bs = require('browser-sync').get('bs-webpack-plugin');	//
						bs.reload();													//
					}
				}
			}]
		}, {
			reload: false // prevent BrowserSync from reloading and let Webpack Dev Server take care of all none .html
		})
	]
}
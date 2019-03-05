/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//const TerserPlugin = require('terser-webpack-plugin');
//const PrettierPlugin = require('prettier-webpack-plugin');
const { version } = require('./package.json');

const destination = 'dist';
const mode = 'production'; // or none

module.exports = {
  mode,
  context: __dirname,
  entry: './src/index.ts',
  output: {
    filename: `code-${version}.js`,
    path: path.resolve(__dirname, destination),
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
  optimization: {
    minimizer: [
//      new TerserPlugin({
//        terserOptions: {
//          //ecma: undefined,
//          warnings: false,
//          parse: {},
//          compress: {},
//          mangle: false, // Note `mangle.properties` is `false` by default.
//          module: false,
//          output: null,
//          toplevel: false,
//          nameCache: null,
//          ie8: true,
//          keep_classnames: undefined,
//          keep_fnames: false,
//          safari10: false,
//        },
//      }),
      new UglifyJSPlugin({
       uglifyOptions: {
          ie8: true,
          warnings: false,
          mangle: false,
          compress: {
            properties: false,
            warnings: false,
            drop_console: false
          },
          output: {
            beautify: true
          }
       }
     })
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: [/\.jsx?$/, /\.tsx?$/],
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          "@typescript-eslint/no-use-before-define": ["error", { "variables": false, "functions": false }],
          "no-use-before-define": ["error", { "variables": false, "functions": false}],     
	  cache: true,
	  fix: true,
          failOnError: false,
          presets: [
            '@babel/env',
            '@babel/typescript',
            {
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true}],
                ["@babel/proposal-object-rest-spread"],
                ["@babel/plugin-transform-property-literals"],
                ["@babel/plugin-transform-member-expression-literals"],
                ["@babel/plugin-transform-object-assign"],
                ["array-includes"],
                ["@babel/plugin-proposal-class-properties"],
              ]
            }
          ]
        }
      },
      {
        test: [/\.jsx?$/,/\.tsx?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: [
            '@babel/env',
            '@babel/typescript',
            {
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true}],
                ["@babel/plugin-proposal-class-properties"],
                ["@babel/proposal-object-rest-spread"],
                ["@babel/plugin-transform-property-literals"],
                ["@babel/plugin-transform-member-expression-literals"],
                ["@babel/plugin-transform-object-assign"],
                ["array-includes"],
              ]
            }
          ] 
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([destination]),
    new CopyWebpackPlugin([
      {
        from: './src/**/*.html',
        flatten: true,
        to: path.resolve(__dirname, destination)
      },
      {
        from: './icons/*.png',
        to: path.resolve(__dirname, destination)
      },
      {
        from: './manifest.json',
        to: path.resolve(__dirname, destination)
      },
      {
        from: './appsscript.json',
        to: path.resolve(__dirname, destination)
      },
      
    ]),
//        printWidth: 80,               // Specify the length of line that the printer will wrap on.
//        tabWidth: 2,                  // Specify the number of spaces per indentation-level.
//        useTabs: false,               // Indent lines with tabs instead of spaces.
//        semi: true,                   // Print semicolons at the ends of statements.
//        encoding: 'utf-8',            // Which encoding scheme to use on files
//        extensions: [ ".js", ".ts" ]  // Which file extensions to process
//    }),
    new GasPlugin({
      comments: false
    }),

  ]
};

const path = require('path')

module.exports = (env, argv) => {
    return {
        context: path.resolve(__dirname, 'example/src'),
        mode: 'development',
        entry: {
            index: './index.js'
       },
        output: {
            filename: 'index.js',
            publicPath: '/'
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            alias:{
                'react-keep-layout': path.resolve(__dirname,'src/Masonry')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx|ts|js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/env',
                                '@babel/react',
                                '@babel/typescript',
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-class-properties", {loose: true}],
                                "@babel/plugin-proposal-object-rest-spread",
                            ]
                        }
                    }
                },
            ]
        },
         
        devServer: {
            contentBase: path.resolve(__dirname, 'example/src'),
            host: '127.0.0.1',
            port: 3001,
            hot: true,
            disableHostCheck: true,
            headers: { "Access-Control-Allow-Origin": "*" },
        }
    }
}

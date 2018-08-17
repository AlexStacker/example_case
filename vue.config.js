/* eslint-disable indent */

module.exports = {
  chainWebpack: config => {
    // 修改入口文件
    config
      .entry('app')
        .clear()
        .add('./src/app.ts')
        .end()
      .plugin('define')
        // 增加 环境变量 __DEV__
        .tap(args => {
          let arg = args[0];
          let rst = [
            {
              ...arg,
                __DEV__: process.env.NODE_ENV !== 'production'
            }
          ];
          return rst;
        })
        .end()
      .module
        .rule('ts')
          .use('ts-loader')
          .tap(options => {
            console.log(options);
            options = {
              ...options
              // getCustomTransformers: () => ({
              //   // before: [yourImportedTransformer]
              // })
            };
            return options;
          });
  }
};

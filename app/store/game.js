const scenes = (ctx => ctx.keys().reduce((acc, file, scenes) => {
  return { ...acc, ...ctx.keys().map(ctx)[scenes] }
}, {}))(require.context('~root/scenes', true, /\.ni$/))

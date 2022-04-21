require('esbuild').buildSync({
  entryPoints: ['index.ts'],
  outfile: 'index.js',
  format:"cjs",
  platform:"node",
  target:"node14",
  external:["esbuild","debug"],
  bundle:true
})
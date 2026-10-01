import { context } from 'esbuild';
const ctx = await context({entryPoints:['src/main.ts'],bundle:true,sourcemap:true,outfile:'dist/bundle.js'});
await ctx.watch();
const server = await ctx.serve({servedir:'.',host:'127.0.0.1',port:5173});
console.log(`La Prairie : http://localhost:${server.port}`);

const madge = require('madge');
const path = require('path');

function pruneTree(subtree, tree) {
  if (!subtree || subtree.length === 0) return;
  for (let child of subtree) {
    const nextSubtree = tree[child];
    if (tree[child]) {
      delete tree[child];
    }
    pruneTree(nextSubtree, tree);
  }
}

madge(path.join(__dirname, './src'), {
  baseDir: path.join(__dirname, './'),
  fileExtensions: ['ts', 'tsx', 'jsx', 'js'],
  tsConfig: path.join(__dirname, './tsconfig.json'),
  resolveAlias: {
    '@': path.join(__dirname, './src'),
  },
  excludeRegExp: [/^\.next[\\/]/, /^out[\\/]/, /^next\.config\.js/, /^scripts[\\/]/],
}).then((res) => {
  const tree = res.obj();
  const entrypoints = Object.keys(tree).filter(
    (e) =>
      /^src\/app(?:\/.*)?\/(page|layout|template|error|loading|not-found|route|head)\.(ts|tsx)$/.test(
        e,
      ) ||
      /^src\/app\/(robots|sitemap)\.(ts|tsx)$/.test(e) ||
      /^src\/middleware\.(ts|tsx)$/.test(e) ||
      /^src[\\\/]prisma[\\\/]client[\\\/]/.test(e),
  );

  pruneTree(entrypoints, tree);

  const unusedFiles = Object.keys(tree);
  if (unusedFiles.length) {
    console.log(
      `⚠️  Found ${unusedFiles.length} files that no one is depending on, please consider removing:`,
    );
    unusedFiles.forEach((file) => {
      console.log('\x1b[33m%s\x1b[0m', file);
    });
    process.exit(0);
  } else {
    console.log('🎉 No unused files!');
    process.exit(0);
  }
});

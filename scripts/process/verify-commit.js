const msgPath = process.env.HUSKY_GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.error(`
      不合法的commit消息格式
      请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md
  `);
  process.exit(1);
}

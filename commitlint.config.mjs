export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，如空格、分号等）
        'refactor', // 代码重构（既不是修复 bug，也不是添加新功能）
        'perf', // 性能优化
        'test', // 添加测试
        'build', // 构建相关
        'ci', // 持续集成
        'chore', // 其他不影响代码运行的更改
        'revert', // 代码回退
      ],
    ],
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
  },
};

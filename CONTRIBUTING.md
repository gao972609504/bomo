# Contributing to MarkFlow

感谢你对 MarkFlow 的关注！欢迎提交 Issue 和 Pull Request。

Thank you for your interest in MarkFlow! Issues and Pull Requests are welcome.

---

## 开发环境设置 | Development Setup

```bash
# 克隆仓库 | Clone the repository
git clone https://github.com/gao972609504/markflow.git
cd markflow

# 安装依赖 | Install dependencies
npm install

# 启动开发模式 | Start dev mode
npm run dev
```

### 环境要求 | Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## 贡献流程 | Contribution Workflow

1. **Fork** 本仓库 | Fork this repository
2. 创建功能分支 | Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 提交更改 | Commit your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. 推送分支 | Push your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. 提交 **Pull Request**

---

## 代码规范 | Code Style

- 使用 **TypeScript** 编写所有新代码
- 遵循现有代码风格（2 空格缩进、单引号）
- React 组件使用函数式组件 + Hooks
- 确保 `npm run build` 无错误

---

## Commit 规范 | Commit Convention

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | Description |
|------|------|-------------|
| `feat` | 新功能 | New feature |
| `fix` | 修复 Bug | Bug fix |
| `docs` | 文档变更 | Documentation change |
| `style` | 格式调整（不影响逻辑） | Code style change |
| `refactor` | 重构（非新功能/修复） | Refactoring |
| `perf` | 性能优化 | Performance improvement |
| `test` | 测试相关 | Test related |
| `chore` | 构建/工具变更 | Build/tooling change |

### 示例 | Examples

```
feat(editor): add table column alignment support
fix(preview): resolve KaTeX rendering error for block formulas
docs: update English README
```

---

## PR 提交规范 | Pull Request Guidelines

- 标题遵循 Commit 规范格式
- 描述清楚变更内容和原因
- 关联相关 Issue（如 `Fixes #123`）
- 确保 `npm run build` 通过
- 小而专注的 PR 优先，避免大规模重构

---

## 报告问题 | Reporting Issues

提交 Issue 时请包含：

- 操作系统和版本（Windows/macOS/Linux）
- MarkFlow 版本
- 重现步骤
- 期望行为和实际行为
- 如有可能，附上截图

---

## 许可证 | License

提交代码即表示你同意在 [MIT License](LICENSE) 下发布你的贡献。

By contributing, you agree that your code will be published under the [MIT License](LICENSE).

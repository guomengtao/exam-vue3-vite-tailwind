# Vue3 Vite Tailwind CSS 示例项目

这是一个展示如何在 Vue 3 和 Vite 项目中配置和使用 Tailwind CSS 的简单示例。

## 功能特点

- 使用 Vue 3 组合式 API
- 使用 Vite 作为构建工具
- 集成 Tailwind CSS 样式框架
- ES Module 配置
- PostCSS 集成

## 项目设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 关键配置文件

- `postcss.config.js` - PostCSS 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `vite.config.js` - Vite 配置
- `src/assets/main.css` - Tailwind CSS 入口文件

## 常见问题

1. 样式不生效
   - 检查 `main.css` 是否正确引入
   - 检查 `tailwind.config.js` 的 `content` 配置
   - 检查 `postcss.config.js` 的语法是否正确

2. 构建失败
   - 检查依赖版本是否兼容
   - 检查配置文件语法是否正确
   - 检查 Node.js 版本是否兼容

## 英文文档

For English documentation, please refer to [README.md](README.md)

## 日文文档

For Japanese documentation, please refer to [README_JA.md](README_JA.md) 
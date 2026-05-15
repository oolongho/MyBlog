---
title: 日常开发中的 Git 技巧
date: 2026-05-01
tags: [Git, 工具]
excerpt: 分享一些日常开发中常用的 Git 技巧和命令。
---

## 修改上一次提交

```bash
git commit --amend
```

## 交互式变基

```bash
git rebase -i HEAD~3
```

## 暂存工作区

```bash
git stash
git stash pop
```

## 查看某个文件的修改历史

```bash
git log -p -- path/to/file
```

## 撤销已推送的提交

```bash
git revert <commit-hash>
```

> 注意：`git revert` 会创建一个新的撤销提交，而不是删除历史记录，这是更安全的做法。

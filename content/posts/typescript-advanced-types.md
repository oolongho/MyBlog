---
title: TypeScript 高级类型技巧
date: 2026-05-08
tags: [TypeScript, 前端]
series: TypeScript 进阶
seriesOrder: 1
excerpt: 深入理解 TypeScript 中的高级类型操作，包括条件类型、映射类型和模板字面量类型。
---

## 条件类型

条件类型是 TypeScript 中最强大的类型工具之一：

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'> // true
type B = IsString<42>      // false
```

## 映射类型

映射类型可以基于已有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

## 模板字面量类型

TypeScript 4.1 引入了模板字面量类型：

```typescript
type EventName = `on${Capitalize<string>}`
// "onClick" | "onFocus" | ...
```

## 总结

掌握这些高级类型技巧，可以写出更安全、更优雅的 TypeScript 代码。

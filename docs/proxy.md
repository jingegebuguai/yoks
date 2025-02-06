# Proxy

#### 自动追踪变化

```typescript
// 不使用 Proxy 的传统方式
const store = {
  state: { count: 0 },
  setState(newState) {
    this.state = newState;
    this.notify(); // 需要手动调用通知
  },
};

// 使用 Proxy 的方式
const state = new Proxy(
  { count: 0 },
  {
    set(target, property, value) {
      target[property] = value;
      notify(); // 自动触发通知
      return true;
    },
  }
);
```

#### 更好的开发体验

```typescript
// 不使用 Proxy
store.setState({ count: store.getState().count + 1 });

// 使用 Proxy
state.count += 1; // 直接修改，更符合直觉
```

#### 细粒度的变更检测

```typescript
const store = new Proxy(
  {
    user: { name: "John", age: 25 },
    settings: { theme: "dark" },
  },
  {
    set(target, property, value) {
      target[property] = value;
      // 只有实际发生变化的属性才会触发更新
      notify();
      return true;
    },
  }
);
```

#### 拦截和验证

```typescript
const store = new Proxy(initialState, {
  set(target, property, value) {
    // 可以在设置值之前进行验证
    if (property === "age" && typeof value !== "number") {
      throw new Error("Age must be a number");
    }

    // 可以在这里添加日志
    console.log(`Setting ${String(property)} to ${value}`);

    target[property] = value;
    notify();
    return true;
  },
});
```

#### 不可变性保证

```typescript
const store = new Proxy(initialState, {
  set(target, property, value) {
    if (Object.isFrozen(target)) {
      throw new Error("Cannot modify frozen state");
    }
    target[property] = value;
    notify();
    return true;
  },
});
```

缺陷

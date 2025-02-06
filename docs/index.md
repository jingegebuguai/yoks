---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Yoki"
  text: "A simple cross-framework state management solution"
  tagline: Simple、Cross-framework
  image:
    src: /logo.png
  actions:
    - theme: brand
      text: Document
      link: /document
    - theme: alt
      text: API
      link: /api-examples

features:
  - title: 🎯 Simple and intuitive API
    details: The library provides a minimal and easy-to-understand API, reducing the learning curve and making state management straightforward. Developers can quickly integrate and use it without complex setup.
  - title: 🔄 Reactive state updates
    details: State changes are automatically tracked and trigger updates only when necessary. This ensures efficient re-renders and improves performance without requiring manual optimizations.
  - title: 🎨 Framework agnostic
    details: Designed to work seamlessly with various frontend frameworks like React, Vue, Svelte, and SolidJS. It allows developers to use the same state management logic across different environments.
  - title: 📦 Tiny size
    details: The library is lightweight, often just a few kilobytes in size, ensuring fast loading times and minimal impact on bundle size. Ideal for projects where performance and efficiency are priorities.
  - title: 💪 TypeScript support
    details: Built with TypeScript in mind, it provides strong type safety, better developer experience, and improved maintainability by catching errors early during development.
  - title: 🔍 Proxy-based state tracking
    details: Uses JavaScript's Proxy to track state changes efficiently at a deep level. This allows for automatic reactivity, eliminating the need for manual subscriptions or immutable state structures.
---

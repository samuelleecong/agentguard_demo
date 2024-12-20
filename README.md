# AgentGuard Demo

A demonstration of AgentGuard's capability to detect and prevent unsafe AI agent workflows through security constraint validation.

## Demo Video

https://github.com/samuelleecong/agentguard_demo/assets/videos/agentguard_demo_final.mov

[Watch the full demo video](https://github.com/samuelleecong/agentguard_demo/assets/videos/agentguard_demo_final.mov)

## Features

- Detection of unsafe workflow patterns in AI agent operations
- Security constraint validation and enforcement
- Real-time workflow analysis
- SELinux-based security policy implementation

## Getting Started

```bash
npm install
npm run dev
```

## Security Features

The demo showcases:
- Workflow validation for potential security risks
- Detection of unauthorized file operations
- Security constraint enforcement
- Test case validation for security measures

## Technical Stack

- React + TypeScript + Vite
- SELinux security policies
- Custom security constraint validation
- Automated test suites for security verification

## Development

For local development, the project uses Vite with React. The security constraints are implemented through SELinux policies and custom validation logic.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

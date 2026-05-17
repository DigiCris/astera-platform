# 🏗 Scaffold-ETH 2 + _Shadcn_

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH 2 Documentation</a> |
  <a href="https://ui.shadcn.com">Shadcn Documentation</a>
</h4>

## 📝 Description

This project is based on Scaffold-ETH 2 and integrates the modern Shadcn UI framework, used by teams at companies such as Vercel, Twitter/X, ElevenLabs, and many others. The goal is to introduce cutting-edge frontend practices into the existing stack, helping developers build elegant, scalable dApps with a modern experience.

## 👁️ Preview

<p align="center">
  <a href="https://youtu.be/ANKYLGePd0U">📽️ Youtube Video</a>
</p>

<img width="2472" height="1384" alt="Home Page" src="https://github.com/user-attachments/assets/70f8754e-35ba-471b-b53b-9bc23d366f6c" />
<br/>
<img width="2472" height="1384" alt="Debug Contracts Page" src="https://github.com/user-attachments/assets/2bcacfe9-3b84-4a54-8030-2db9e51533b1" />
<br/>
<img width="2472" height="1450" alt="QR Dialog" src="https://github.com/user-attachments/assets/6ef4a286-3579-4faf-a724-f76a2e476df1" />

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

> 1️⃣ Clone repository

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git my-app
cd my-app
rm -rf .git
```

> 2️⃣ Install dependens

```
yarn install
```

> 3️⃣ Initialize your own Git repository

```
git init
git add .
git commit -m "Initial commit from Scaffold-ETH 2"
```

> [!IMPORTANT]
> If you want to add more [shadcn](https://ui.shadcn.com/) components, you must add the following command inside the nextjs folder

```
cd packages/nextjs/
npx shadcn@latest add button
```

## UI Components (Shadcn) already added

> [!NOTE]
> All components added so far do not need to be overwritten.
> You can find them at `components/ui/shadcn`

- Accordion
- Alert
- Badge
- Button
- Card
- Collapsible
- Dialog
- Dropdown Menu
- Input
- Scroll Area
- Separator
- Sheet
- Sidebar
- Skeleton
- Sonner
- Switch
- Table
- Tooltip

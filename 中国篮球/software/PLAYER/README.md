# 球员信息管理系统（桌面端）- 数据库阶段

本阶段只做“可落地”的数据库层：SQLite 建表脚本 + Python 连接与初始化模块（不含任何 GUI 代码）。

## 技术选型（本仓库默认）

- **语言**：Python 3.11+（标准库 `sqlite3` 即可）
- **数据库**：SQLite（单文件、部署最简单，适合桌面端）
- **打包部署（后续 GUI 阶段）**：PyInstaller（生成单机可运行程序）
- **GUI（后续阶段再接入）**：PySide6（Qt，成熟、跨平台、桌面端体验好）

选择理由（聚焦你本阶段诉求）：

- **开发效率**：SQLite + Python 标准库即可完成建表、迁移（轻量）、查询封装。
- **部署便利**：SQLite 无需安装服务端；数据库就是一个 `.db` 文件。
- **agent 生成代码兼容性**：Python/SQLite 组合最稳、依赖最少、可直接运行与验证。

## 目录结构

见下方的 `src/` 结构与 `sql/` 脚本：

- `sql/schema.sql`：完整 DDL（含外键开启说明、索引、约束）
- `src/player/db/database.py`：数据库连接管理 + 初始化入口

## 快速开始

在 `PLAYER/` 目录下运行：

```bash
python -m src.player.db.database
```

默认会在 `PLAYER/data/player.db` 创建数据库并执行 `sql/schema.sql` 建表。


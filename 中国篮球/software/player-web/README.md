# Web 球员信息管理系统（Flask + SQLite）

这是一个**网页版**球员信息管理系统（CRUD），复用上一阶段的 SQLite 数据模型，不包含桌面端代码。

## 技术栈

- **后端**：Python 3.11 + Flask
- **数据库**：SQLite（单文件 `data/player.db`）
- **前端**：服务端渲染（Jinja2 模板）+ 少量 CSS（无 Node 依赖，最省事）

## 运行

在 PowerShell 里：

```powershell
cd C:\Users\Lenovo\Desktop\software\player-web
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
py .\app.py
```

然后浏览器打开：

- `http://127.0.0.1:5000`

## 数据库

- 首次启动会自动创建 `data/player.db` 并执行 `sql/schema.sql` 建表
- 你也可以用 DB Browser for SQLite 打开该文件查看数据


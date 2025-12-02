# Git Commit Message

```markdown
feat: 添加 Twin Info Card 双信息显示卡片组件

新增一个美观、现代的 Home Assistant Lovelace 自定义卡片，用于显示一个或两个实体的信息。

## 主要功能

- 支持显示单个或双个实体的数据
- 自定义标签功能（默认使用实体友好名称）
- 值映射功能，支持将实体值映射为自定义显示文本
- 自定义图标和图标颜色支持
- 点击动作支持（more-info、navigate、call-service、toggle）
- 完美支持亮色和暗色主题
- UI 可视化配置编辑器

## 新增文件

- `twin-info-card.js` - 主卡片文件（包含卡片类和配置编辑器）
- `README.md` - 完整的使用文档
- `hacs.json` - HACS 配置文件
- `manifest.json` - 清单文件
- `example-usage.yaml` - 使用示例

## 技术实现

- 使用原生 Web Components（不依赖外部框架）
- 遵循 Home Assistant 卡片开发规范
- 支持 Shadow DOM 和 Light DOM（配置编辑器）
- 使用 Home Assistant 内置组件（ha-card、ha-icon、ha-form）

## 配置选项

- `entity1` (必需) - 第一个实体 ID
- `entity2` (可选) - 第二个实体 ID
- `name` (可选) - 卡片主标题
- `label1` / `label2` (可选) - 数据标签
- `icon` (可选) - 图标名称
- `icon_color` (可选) - 图标颜色
- `value_mapping1` / `value_mapping2` (可选) - 值映射配置
- `tap_action` (可选) - 点击动作配置

## 界面设计

- 左侧图标区域（支持自定义颜色和背景）
- 主标题显示
- 副标题显示两组数据（格式：标签 值 · 标签 值）
- 类似 Mushroom 卡片的设计风格

## 文档

- 包含完整的 README.md 文档
- 提供多个使用示例
- 包含故障排除指南
```


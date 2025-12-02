# Twin Info Card

一个美观、现代的 Home Assistant Lovelace 自定义卡片，用于显示两个实体的信息。采用类似 Mushroom 的设计风格，支持亮色和暗色主题。

## 功能特性

* ✅ **双实体显示**：支持显示一个或两个实体的数据
* ✅ **自定义标签**：可为每个数据自定义显示标签（默认使用实体名称）
* ✅ **值映射功能**：支持将实体值映射为自定义显示文本
* ✅ **图标支持**：可自定义图标和图标颜色
* ✅ **点击动作**：支持 more-info、navigate、call-service、toggle 等点击动作
* ✅ **主题适配**：完美支持亮色和暗色主题
* ✅ **UI 配置**：支持可视化配置编辑器，无需手写 YAML

## 安装方法

### 方法一：通过 HACS 安装（推荐）

1. 在 HACS 中，进入 "Frontend" 分类
2. 点击右上角的三个点菜单
3. 选择 "Custom repositories"
4. 添加此仓库：  
   * Repository: `LuckyStarry/lovelace-twin-info-card`  
   * Category: `Frontend`
5. 点击 "Install" 安装
6. 在 Home Assistant 配置中添加资源

### 方法二：手动安装

1. 下载 `twin-info-card.js` 文件
2. 将文件复制到 Home Assistant 的 `www/twin-info-card/` 目录
3. 在 Home Assistant 配置中添加资源

## 配置资源

在 Home Assistant 的配置中添加资源：

**通过 UI 配置：**

1. 进入 "设置" > "仪表盘" > "资源"
2. 点击 "添加资源"
3. 选择 "JavaScript 模块"
4. 输入 URL: `/hacsfiles/lovelace-twin-info-card/twin-info-card.js`（HACS 安装） 或 `/local/twin-info-card/twin-info-card.js`（手动安装）
5. 点击 "创建"

**通过 YAML 配置：**

在 `configuration.yaml` 中添加：

```yaml
lovelace:
  resources:
    - url: /hacsfiles/lovelace-twin-info-card/twin-info-card.js
      type: module
```

## 使用方法

### 通过 UI 配置（推荐）

1. 在 Lovelace 编辑模式下，点击 "添加卡片"
2. 搜索 "Twin Info Card" 或 "双信息卡片"
3. 在可视化编辑器中：  
   * 输入主标题（可选）
   * 选择第一个实体（必需）
   * 选择第二个实体（可选）
   * 输入第一个数据标签（可选）
   * 输入第二个数据标签（可选）
   * 选择图标（可选）
   * 选择图标颜色（可选）
4. 点击 "保存"

### 通过 YAML 配置

#### 基本用法 - 显示单个实体

```yaml
type: custom:twin-info-card
entity1: sensor.temperature
name: 主卧
```

#### 显示两个实体

```yaml
type: custom:twin-info-card
entity1: sensor.temperature
entity2: sensor.humidity
name: 主卧
icon: mdi:bed-king
icon_color: "#ff4081"
```

#### 自定义标签

```yaml
type: custom:twin-info-card
entity1: sensor.temperature
entity2: sensor.humidity
name: 主卧
label1: 温度
label2: 湿度
icon: mdi:bed-king
icon_color: "#ff4081"
```

#### 带值映射

```yaml
type: custom:twin-info-card
entity1: sensor.door_sensor_state
entity2: sensor.window_sensor_state
name: 门窗状态
label1: 门
label2: 窗
value_mapping1:
  "on": "开启"
  "off": "关闭"
value_mapping2:
  "on": "开启"
  "off": "关闭"
icon: mdi:home
icon_color: "#4caf50"
```

#### 带点击动作

```yaml
type: custom:twin-info-card
entity1: sensor.temperature
entity2: sensor.humidity
name: 主卧
icon: mdi:bed-king
icon_color: "#ff4081"
tap_action:
  action: more-info
  entity_id: sensor.temperature
```

## 配置选项

| 参数            | 类型     | 必需 | 默认值            | 说明                                    |
| ------------- | ------ | -- | -------------- | ------------------------------------- |
| entity1       | string | ✅  | \-             | 第一个实体的 ID（必需）                          |
| entity2       | string | ❌  | \-             | 第二个实体的 ID（可选，如果未指定则只显示第一个实体）          |
| name          | string | ❌  | 实体1的友好名称      | 卡片主标题                                  |
| label1        | string | ❌  | 实体1的友好名称      | 第一个数据的标签（如果未指定，使用实体的 friendly_name）    |
| label2        | string | ❌  | 实体2的友好名称      | 第二个数据的标签（如果未指定，使用实体的 friendly_name）    |
| icon          | string | ❌  | `mdi:information` | 图标名称（Material Design Icons）            |
| icon_color    | string | ❌  | 主题主色           | 图标颜色（支持十六进制颜色值，如 `#ff4081`）            |
| value_mapping1 | object | ❌  | \-             | 第一个实体的值映射（键为原始值，值为显示文本）                |
| value_mapping2 | object | ❌  | \-             | 第二个实体的值映射（键为原始值，值为显示文本）                |
| tap_action    | object | ❌  | \-             | 点击动作配置（支持 `more-info`、`navigate`、`call-service`、`toggle`） |

### tap_action 配置

#### more-info

显示实体的详细信息：

```yaml
tap_action:
  action: more-info
  entity_id: sensor.temperature  # 可选，默认使用 entity1
```

#### navigate

导航到指定路径：

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/room
```

#### call-service

调用服务：

```yaml
tap_action:
  action: call-service
  service: light.toggle
  service_data:
    entity_id: light.bedroom
```

#### toggle

切换实体状态：

```yaml
tap_action:
  action: toggle
```

## 值映射功能

值映射功能允许你将实体的原始值转换为更易读的文本。支持字符串值和数值的映射。

### 字符串值映射

```yaml
value_mapping1:
  "on": "开启"
  "off": "关闭"
  "unknown": "未知"
```

### 数值映射

```yaml
value_mapping1:
  0: "关闭"
  1: "开启"
  2: "待机"
```

### 混合映射

```yaml
value_mapping1:
  "on": "开启"
  "off": "关闭"
  25: "正常"
  30: "高温"
```

## 依赖项

### 必需依赖（Home Assistant 内置，无需安装）

* ✅ `ha-card`, `ha-icon`, `ha-form` - Home Assistant 核心组件

### 可选依赖

无。此卡片**不需要任何额外依赖**！

## 界面说明

1. **图标区域**：左侧显示自定义图标，支持自定义颜色
2. **主标题**：显示卡片名称或第一个实体的友好名称
3. **副标题**：显示两个实体的数据，格式为 "标签 值 · 标签 值"

## 自定义样式

卡片使用 CSS 变量，可以通过 `card-mod` 自定义样式：

```yaml
type: custom:twin-info-card
entity1: sensor.temperature
entity2: sensor.humidity
name: 主卧
card_mod:
  style: |
    .twin-info-card {
      border-radius: 16px;
    }
```

## 故障排除

### 1. 卡片不显示

* 检查资源是否正确添加
* 检查浏览器控制台是否有错误
* 确认实体 ID 是否正确
* 尝试强制刷新页面（Ctrl+F5 或 Cmd+Shift+R）

### 2. 实体值不显示

* 检查实体是否存在且状态正常
* 检查浏览器控制台是否有错误
* 确认实体 ID 格式正确（格式：`domain.entity_id`）

### 3. 值映射不生效

* 确认映射键的类型与实体值的类型匹配（字符串或数字）
* 检查映射键是否完全匹配实体值（区分大小写）
* 查看浏览器控制台是否有错误信息

### 4. UI 配置编辑器不显示

* 确保已正确安装并添加资源
* 清除浏览器缓存
* 检查浏览器控制台是否有错误

### 5. 点击动作无响应

* 检查 `tap_action` 配置是否正确
* 确认实体支持对应的操作
* 检查浏览器控制台是否有错误

### 6. 样式异常

* 清除浏览器缓存
* 检查是否有其他卡片样式冲突
* 确认 Home Assistant 版本是否支持（建议 2023.1.0+）

## 开发说明

### 文件结构

```
lovelace-twin-info-card/
├── twin-info-card.js    # 主卡片文件
├── README.md            # 使用说明
├── hacs.json            # HACS 配置
├── example-usage.yaml   # 使用示例
├── manifest.json        # 清单文件
└── LICENSE              # 许可证
```

### 技术栈

* 原生 Web Components（不依赖 Lit）
* Home Assistant 核心组件

### 实体要求

卡片支持任何类型的 Home Assistant 实体，包括：

* `sensor` - 传感器实体
* `binary_sensor` - 二进制传感器实体
* `switch` - 开关实体
* `light` - 灯光实体
* 其他任何有 `state` 属性的实体

## 许可证

MIT License

Copyright (c) 2025 SUN BO

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


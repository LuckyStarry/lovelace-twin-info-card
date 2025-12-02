class TwinInfoCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this._hasRendered = false;
  }

  async connectedCallback() {
    // 确保 Home Assistant 组件已加载
    try {
      if (window.loadCardHelpers) {
        const helpers = await window.loadCardHelpers();
        if (helpers && helpers.loadHaComponents) {
          await helpers.loadHaComponents();
        }
      }
    } catch (e) {
      // 继续执行，不阻塞渲染
    }

    if (this._config && this._hass) {
      this._render();
    }
  }

  setConfig(config) {
    this._config = config || {};
    if (this.isConnected && !this._hasRendered) {
      this._render();
    } else if (this._hasRendered) {
      this._updateValues();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this.isConnected && this._hasRendered) {
      this._updateValues();
    } else if (this.isConnected && this._config) {
      this._render();
    }
  }

  get hass() {
    return this._hass;
  }

  async _render() {
    this.innerHTML = "";

    // 添加样式使图标和颜色在同一行
    const style = document.createElement("style");
    style.textContent = `
      ha-form ha-icon-picker[data-name="icon"],
      ha-form ha-icon-picker[data-name="icon"] ~ * {
        display: inline-block !important;
      }
      ha-form ha-icon-picker[data-name="icon"] {
        width: calc(50% - 8px) !important;
        margin-right: 16px !important;
      }
      ha-form ha-color-picker[data-name="icon_color"],
      ha-form ha-color-rgb-picker[data-name="icon_color"] {
        width: calc(50% - 8px) !important;
        display: inline-block !important;
      }
    `;
    this.appendChild(style);

    const entityForm = document.createElement("ha-form");

    const schema = [
      {
        name: "name",
        required: false,
        selector: {
          text: {},
        },
      },
      {
        name: "entity1",
        required: true,
        selector: {
          entity: {},
        },
      },
      {
        name: "entity2",
        required: false,
        selector: {
          entity: {},
        },
      },
      {
        name: "label1",
        required: false,
        selector: {
          text: {},
        },
      },
      {
        name: "label2",
        required: false,
        selector: {
          text: {},
        },
      },
      {
        name: "icon",
        required: false,
        selector: {
          icon: {},
        },
      },
      {
        name: "icon_color",
        required: false,
        selector: {
          color_rgb: {},
        },
      },
    ];

    entityForm.hass = this._hass;
    entityForm.data = {
      name: (this._config && this._config.name) || "",
      entity1: (this._config && this._config.entity1) || "",
      entity2: (this._config && this._config.entity2) || "",
      label1: (this._config && this._config.label1) || "",
      label2: (this._config && this._config.label2) || "",
      icon: (this._config && this._config.icon) || "mdi:information",
      icon_color: (this._config && this._config.icon_color) || "",
    };
    entityForm.schema = schema;
    entityForm.computeLabel = (schema) => {
      const labels = {
        name: "主标题",
        entity1: "第一个实体 *",
        entity2: "第二个实体",
        label1: "第一个数据标签",
        label2: "第二个数据标签",
        icon: "图标",
        icon_color: "图标颜色",
      };
      return labels[schema.name] || schema.name;
    };

    entityForm.addEventListener("value-changed", (ev) => {
      if (ev.detail.value) {
        const newConfig = { ...this._config };
        Object.keys(ev.detail.value).forEach((key) => {
          if (
            ev.detail.value[key] !== undefined &&
            ev.detail.value[key] !== ""
          ) {
            newConfig[key] = ev.detail.value[key];
          } else if (key !== "entity1") {
            delete newConfig[key];
          }
        });
        this._config = newConfig;
        this._fireConfigChanged();
      }
    });

    this.appendChild(entityForm);
    this._hasRendered = true;
  }

  _updateValues() {
    const entityForm = this.querySelector("ha-form");
    if (entityForm) {
      entityForm.data = {
        name: (this._config && this._config.name) || "",
        entity1: (this._config && this._config.entity1) || "",
        entity2: (this._config && this._config.entity2) || "",
        label1: (this._config && this._config.label1) || "",
        label2: (this._config && this._config.label2) || "",
        icon: (this._config && this._config.icon) || "mdi:information",
        icon_color: (this._config && this._config.icon_color) || "",
      };
    }
  }

  _fireConfigChanged() {
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

class TwinInfoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._entity1 = null;
    this._entity2 = null;
    this._initialRender = false;
  }

  static getConfigElement() {
    return document.createElement("twin-info-card-editor");
  }

  static getStubConfig(hass, entities) {
    return {
      entity1: entities[0] || "",
      entity2: entities[1] || "",
      name: "信息卡片",
    };
  }

  setConfig(config) {
    if (!config.entity1) {
      throw new Error("请指定第一个实体 (entity1)");
    }
    this._config = config;
    if (this._initialRender) {
      this._updateEntities();
      this._render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this._initialRender) {
      this._updateEntities();
      this._render();
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this._initialRender = true;
    if (this._config && this._hass) {
      this._updateEntities();
      this._render();
    }
  }

  _updateEntities() {
    if (!this._hass || !this._config) return;
    this._entity1 = this._hass.states[this._config.entity1];
    if (this._config.entity2) {
      this._entity2 = this._hass.states[this._config.entity2];
    } else {
      this._entity2 = null;
    }
  }

  _getEntityValue(entity, mapping) {
    if (!entity) return "未知";

    let value = entity.state;
    let hasUnit = false;
    let unit = "";

    // 先应用值映射
    if (mapping && typeof mapping === "object") {
      // 先尝试直接匹配原始值（字符串）
      if (mapping[entity.state] !== undefined) {
        value = mapping[entity.state];
      } else {
        // 尝试数值映射
        const numValue = parseFloat(entity.state);
        if (!isNaN(numValue)) {
          // 尝试整数映射
          if (mapping[Math.floor(numValue)] !== undefined) {
            value = mapping[Math.floor(numValue)];
          } else if (mapping[numValue] !== undefined) {
            value = mapping[numValue];
          } else {
            // 如果映射后没有匹配，保留原始值并检查单位
            if (entity.attributes && entity.attributes.unit_of_measurement) {
              unit = entity.attributes.unit_of_measurement;
              hasUnit = true;
            }
          }
        } else {
          // 如果映射后没有匹配，保留原始值并检查单位
          if (entity.attributes && entity.attributes.unit_of_measurement) {
            unit = entity.attributes.unit_of_measurement;
            hasUnit = true;
          }
        }
      }
    } else {
      // 没有映射，检查单位
      if (entity.attributes && entity.attributes.unit_of_measurement) {
        unit = entity.attributes.unit_of_measurement;
        hasUnit = true;
      }
    }

    // 如果有单位且值不是映射后的文本，添加单位
    if (hasUnit && (!mapping || mapping[entity.state] === undefined)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // 数值类型，直接拼接单位
        value = `${numValue}${unit}`;
      } else {
        // 字符串类型，添加空格
        value = `${value} ${unit}`;
      }
    }

    return value;
  }

  _getEntityLabel(entity, defaultLabel) {
    if (defaultLabel) return defaultLabel;
    if (entity && entity.attributes && entity.attributes.friendly_name) {
      return entity.attributes.friendly_name;
    }
    return "未知";
  }

  _handleClick() {
    if (!this._config.tap_action || !this._hass) return;

    const action = this._config.tap_action;
    const entityId = action.entity_id || this._config.entity1;

    if (action.action === "more-info") {
      this._fireEvent("hass-more-info", { entityId });
    } else if (action.action === "navigate") {
      if (action.navigation_path) {
        window.history.pushState(null, "", action.navigation_path);
        this._fireEvent("location-changed", { replace: false });
      }
    } else if (action.action === "call-service") {
      if (action.service && this._hass.callService) {
        const [domain, service] = action.service.split(".");
        this._hass.callService(domain, service, action.service_data || {});
      }
    } else if (action.action === "toggle") {
      if (entityId && this._hass.callService) {
        const domain = entityId.split(".")[0];
        this._hass.callService(domain, "toggle", { entity_id: entityId });
      }
    }
  }

  _fireEvent(type, detail) {
    const event = new Event(type, {
      bubbles: true,
      composed: true,
      cancelable: false,
    });
    event.detail = detail;
    this.dispatchEvent(event);
  }

  _render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = "";

    // 创建样式
    const style = document.createElement("style");
    style.textContent = `
      .background {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: var(--ha-card-border-radius, 12px);
        margin: calc(-1 * var(--ha-card-border-width, 1px));
        overflow: hidden;
        cursor: ${this._config.tap_action ? "pointer" : "default"};
      }

      .container {
        margin: calc(-1 * var(--ha-card-border-width, 1px));
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .twin-info-card {
        position: relative;
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        pointer-events: none;
      }

      .icon-container {
        position: relative;
        padding: 6px;
        margin: -6px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        box-sizing: border-box;
      }

      .icon-container ha-icon {
        width: 24px;
        height: 24px;
        color: var(--ha-icon-color, var(--primary-color, #03a9f4));
      }

      .content {
        position: relative;
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        transition: background-color 180ms ease-in-out;
      }

      .primary {
        font-size: 14px;
        font-weight: 500;
        color: var(
          --ha-text-primary-color,
          var(--primary-text-color, rgba(0, 0, 0, 0.87))
        );
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .secondary {
        font-size: 12px;
        color: var(
          --ha-text-primary-color,
          var(--primary-text-color, rgba(0, 0, 0, 0.87))
        );
        line-height: 1.2;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 2px;
      }

      .info-item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .info-label {
        font-weight: 500;
      }

      .info-value {
        color: var(
          --ha-text-primary-color,
          var(--primary-text-color, rgba(0, 0, 0, 0.87))
        );
      }

      .separator {
        color: var(
          --ha-text-secondary-color,
          var(--secondary-text-color, rgba(0, 0, 0, 0.38))
        );
      }

      .error {
        padding: 16px;
        color: var(--error-color, #f44336);
        text-align: center;
      }
    `;
    this.shadowRoot.appendChild(style);

    // 创建卡片容器
    const haCard = document.createElement("ha-card");

    // 创建背景层（用于点击区域）
    const background = document.createElement("div");
    background.className = "background";

    // 创建容器层
    const container = document.createElement("div");
    container.className = "container";

    // 创建内容层
    const cardContent = document.createElement("div");
    cardContent.className = "twin-info-card";

    // 检查实体是否存在
    if (!this._entity1) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.textContent = `实体未找到: ${this._config?.entity1 || "未知"}`;
      haCard.appendChild(errorDiv);
      this.shadowRoot.appendChild(haCard);
      return;
    }

    // 创建图标
    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";

    const icon = document.createElement("ha-icon");
    icon.setAttribute("icon", this._config.icon || "mdi:information");
    if (this._config.icon_color) {
      icon.style.color = this._config.icon_color;
    }
    iconContainer.appendChild(icon);

    // 创建内容区域
    const content = document.createElement("div");
    content.className = "content";

    // 主标题
    const primary = document.createElement("div");
    primary.className = "primary";
    primary.textContent =
      this._config.name ||
      this._getEntityLabel(this._entity1, this._config.label1);

    // 副标题
    const secondary = document.createElement("div");
    secondary.className = "secondary";

    // 第一组数据
    const item1 = document.createElement("span");
    item1.className = "info-item";
    const label1 = document.createElement("span");
    label1.className = "info-label";
    label1.textContent =
      this._getEntityLabel(this._entity1, this._config.label1) + " ";
    const value1 = document.createElement("span");
    value1.className = "info-value";
    value1.textContent = this._getEntityValue(
      this._entity1,
      this._config.value_mapping1
    );
    item1.appendChild(label1);
    item1.appendChild(value1);
    secondary.appendChild(item1);

    // 如果有第二个实体，添加分隔符和第二组数据
    if (this._entity2) {
      const separator = document.createElement("span");
      separator.className = "separator";
      separator.textContent = "·";
      secondary.appendChild(separator);

      const item2 = document.createElement("span");
      item2.className = "info-item";
      const label2 = document.createElement("span");
      label2.className = "info-label";
      label2.textContent =
        this._getEntityLabel(this._entity2, this._config.label2) + " ";
      const value2 = document.createElement("span");
      value2.className = "info-value";
      value2.textContent = this._getEntityValue(
        this._entity2,
        this._config.value_mapping2
      );
      item2.appendChild(label2);
      item2.appendChild(value2);
      secondary.appendChild(item2);
    }

    content.appendChild(primary);
    content.appendChild(secondary);

    // 组装卡片
    cardContent.appendChild(iconContainer);
    cardContent.appendChild(content);
    container.appendChild(cardContent);
    haCard.appendChild(background);
    haCard.appendChild(container);

    // 添加点击事件
    if (this._config.tap_action) {
      background.addEventListener("click", () => {
        this._handleClick();
      });
    }

    this.shadowRoot.appendChild(haCard);
  }

  getCardSize() {
    return 1;
  }
}

// 先注册配置编辑器
if (!customElements.get("twin-info-card-editor")) {
  customElements.define("twin-info-card-editor", TwinInfoCardEditor);
}

// 再注册主卡片
if (!customElements.get("twin-info-card")) {
  customElements.define("twin-info-card", TwinInfoCard);

  // 注册到 window.customCards
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "twin-info-card",
    name: "Twin Info Card",
    description: "一个美观的双信息显示卡片，支持显示两个实体的数据",
  });
}

## 目标
- 在录制设置页新增“自定义 package”配置，独立于默认 package，不发生冲突；同时参与录制配置并实时同步到录制页。

## 技术方案
- 扩展 Pinia 存储 `useRecordSettingStore`：
  - 新增 `customPackages: string[]` 与 `customCheckedList: string[]`
  - Getter `effectiveCheckedList`：`checkedList (默认) ∪ customCheckedList (自定义)` 去重合并。
  - 方法：`addCustomPackage(name)`, `removeCustomPackage(name)`, `setCustomCheckedList(list)`；校验去重与非空。
  - 持久化：以 `projectId` 为 key 写入/读取 `localStorage`，如 `custom-packages:${projectId}`。
- 录制页使用 `effectiveCheckedList` 作为 `recordAPI` 的 `config` 参数，原逻辑不变。

## UI与交互
- 录制设置页 `RecordSetting.vue`：在现有 `RecordControl` 下新增一个风格一致的卡片“自定义 package”。
  - 顶部 `a-input` + “添加”按钮：输入自定义 package 名称并添加到 `customPackages`。
  - 下方 `a-checkbox-group`：勾选参与录制的自定义 package（绑定 `customCheckedList`）。
  - 列表项支持删除：`a-tag` 或 `a-list` 搭配删除按钮。
  - 校验：去除前后空格、禁止空串、禁止与默认 `packageNames` 重复、禁止与现有 `customPackages` 重复。
- 视觉风格：复用 `RecordControl` 的卡片样式（渐变背景、圆角、阴影、间距），保证一致性。

## 数据流
- 初始化：进入设置页时，若 `customPackages` 为空，尝试从 `localStorage` 恢复；默认包仍由 `getInitConfig` 初始化。
- 同步：更改 `customCheckedList` 或默认 `checkedList` 后，`effectiveCheckedList` 自动更新；录制页轮询时始终读取最新合并结果。

## 后端交互
- 无需新增接口；`recordAPI` 的 `config` 参数包含自定义与默认选择的合集，后端按现有逻辑处理。

## 测试计划
- 添加自定义 package：验证加入列表且可勾选；刷新后从 `localStorage` 恢复。
- 冲突校验：与默认包同名时拒绝添加；与已有自定义重复时拒绝添加。
- 录制联动：在录制页开启录制，确认 `config` 包含自定义与默认选项合集；停止录制同样携带最新合集。
- UI一致性：两卡片风格一致；交互无控制台/网络错误。

## 风险与回滚
- 风险低，改动集中在 Store 与设置页；若不满意，可移除自定义卡片并保留 Store 扩展不启用。
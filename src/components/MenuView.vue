<template>
  <div class="menu-container">
    <h1>物流系统菜单管理</h1>
    
    <!-- 水平菜单 -->
    <div class="menu-section">
      <h3>水平菜单</h3>
      <ul class="horizontal-menu">
        <li v-for="item in horizontalMenu" :key="item.id" 
            :class="{ active: activeHorizontalMenu === item.id }"
            @click="selectHorizontalMenu(item)">
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </li>
      </ul>
    </div>
    
    <!-- 垂直菜单 -->
    <div class="menu-section">
      <h3>垂直菜单</h3>
      <ul class="vertical-menu">
        <li v-for="item in verticalMenu" :key="item.id" 
            :class="{ active: activeVerticalMenu === item.id, 'has-submenu': item.children }"
            @click="toggleVerticalMenu(item)">
          <div class="menu-item">
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-label">{{ item.label }}</span>
            <span v-if="item.children" class="menu-arrow">
              {{ item.expanded ? '▼' : '▶' }}
            </span>
          </div>
          
          <!-- 子菜单 -->
          <ul v-if="item.expanded && item.children" class="submenu">
            <li v-for="subItem in item.children" :key="subItem.id"
                :class="{ active: activeSubMenu === subItem.id }"
                @click.stop="selectSubMenu(subItem)">
              <span class="submenu-icon">{{ subItem.icon }}</span>
              <span class="submenu-label">{{ subItem.label }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    
    <!-- 选中菜单信息 -->
    <div v-if="selectedMenu" class="selected-menu-info">
      <h3>当前选中菜单</h3>
      <div class="info-card">
        <div class="info-header">
          <span class="menu-icon-large">{{ selectedMenu.icon }}</span>
          <div class="info-title">
            <h4>{{ selectedMenu.label }}</h4>
            <span class="menu-id">ID: {{ selectedMenu.id }}</span>
          </div>
        </div>
        <div class="info-content">
          <p><strong>路径：</strong>{{ selectedMenu.path || '无' }}</p>
          <p><strong>类型：</strong>{{ selectedMenu.type || '菜单项' }}</p>
          <p><strong>描述：</strong>{{ selectedMenu.description || '暂无描述' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 水平菜单数据
const horizontalMenu = reactive([
  { id: 'h1', icon: '🏠', label: '首页', path: '/', type: '导航菜单', description: '系统首页仪表板' },
  { id: 'h2', icon: '📦', label: '运单管理', path: '/orders', type: '功能菜单', description: '运单创建、查询和管理' },
  { id: 'h3', icon: '👥', label: '客户管理', path: '/customers', type: '功能菜单', description: '客户信息维护' },
  { id: 'h4', icon: '🏭', label: '仓库管理', path: '/warehouse', type: '功能菜单', description: '仓库库存管理' },
  { id: 'h5', icon: '🚚', label: '运输管理', path: '/transport', type: '功能菜单', description: '运输路线和车辆管理' },
  { id: 'h6', icon: '📊', label: '统计分析', path: '/analytics', type: '报表菜单', description: '数据统计和分析' }
]);

// 垂直菜单数据
const verticalMenu = reactive([
  {
    id: 'v1', 
    icon: '⚙️', 
    label: '系统设置', 
    expanded: false,
    children: [
      { id: 'v1-1', icon: '👤', label: '用户管理', path: '/settings/users' },
      { id: 'v1-2', icon: '🔒', label: '权限管理', path: '/settings/permissions' },
      { id: 'v1-3', icon: '🎨', label: '界面设置', path: '/settings/ui' }
    ]
  },
  {
    id: 'v2', 
    icon: '📋', 
    label: '业务管理', 
    expanded: false,
    children: [
      { id: 'v2-1', icon: '💰', label: '费用管理', path: '/business/costs' },
      { id: 'v2-2', icon: '📝', label: '合同管理', path: '/business/contracts' },
      { id: 'v2-3', icon: '📈', label: '价格策略', path: '/business/pricing' }
    ]
  },
  {
    id: 'v3', 
    icon: '🔔', 
    label: '消息中心', 
    expanded: false,
    children: [
      { id: 'v3-1', icon: '✉️', label: '站内消息', path: '/messages/internal' },
      { id: 'v3-2', icon: '📱', label: '短信通知', path: '/messages/sms' },
      { id: 'v3-3', icon: '📧', label: '邮件通知', path: '/messages/email' }
    ]
  },
  {
    id: 'v4', 
    icon: '❓', 
    label: '帮助中心', 
    expanded: false,
    children: [
      { id: 'v4-1', icon: '📖', label: '使用文档', path: '/help/docs' },
      { id: 'v4-2', icon: '💬', label: '在线客服', path: '/help/support' },
      { id: 'v4-3', icon: '🔄', label: '版本更新', path: '/help/updates' }
    ]
  }
]);

// 选中状态
const activeHorizontalMenu = ref('h1');
const activeVerticalMenu = ref('');
const activeSubMenu = ref('');
const selectedMenu = ref(horizontalMenu[0]);

// 选择水平菜单
const selectHorizontalMenu = (item) => {
  activeHorizontalMenu.value = item.id;
  activeVerticalMenu.value = '';
  activeSubMenu.value = '';
  selectedMenu.value = item;
};

// 切换垂直菜单展开状态
const toggleVerticalMenu = (item) => {
  if (item.children) {
    item.expanded = !item.expanded;
    if (item.expanded) {
      activeVerticalMenu.value = item.id;
      activeHorizontalMenu.value = '';
    } else {
      activeVerticalMenu.value = '';
      activeSubMenu.value = '';
    }
  } else {
    activeVerticalMenu.value = item.id;
    activeHorizontalMenu.value = '';
    selectedMenu.value = item;
  }
};

// 选择子菜单
const selectSubMenu = (item) => {
  activeSubMenu.value = item.id;
  selectedMenu.value = item;
};
</script>

<style scoped>
.menu-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}

.menu-section {
  margin-bottom: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.menu-section h3 {
  background: #f5f5f5;
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

/* 水平菜单样式 */
.horizontal-menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
}

.horizontal-menu li {
  flex: 1;
  text-align: center;
  padding: 15px 10px;
  cursor: pointer;
  border-right: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.horizontal-menu li:last-child {
  border-right: none;
}

.horizontal-menu li:hover {
  background: #f8f9fa;
}

.horizontal-menu li.active {
  background: #1890ff;
  color: white;
}

.horizontal-menu li.active .menu-icon {
  color: white;
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 垂直菜单样式 */
.vertical-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
}

.vertical-menu li {
  border-bottom: 1px solid #f0f0f0;
}

.vertical-menu li:last-child {
  border-bottom: none;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.vertical-menu li.active .menu-item {
  background: #1890ff;
  color: white;
}

.menu-label {
  flex: 1;
  font-weight: 500;
}

.menu-arrow {
  margin-left: 10px;
  font-size: 12px;
}

/* 子菜单样式 */
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.submenu li {
  padding: 10px 20px 10px 50px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.submenu li:last-child {
  border-bottom: none;
}

.submenu li:hover {
  background: #f0f0f0;
}

.submenu li.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: bold;
}

.submenu-icon {
  margin-right: 8px;
  font-size: 14px;
}

.submenu-label {
  font-size: 14px;
}

/* 选中菜单信息样式 */
.selected-menu-info {
  margin-top: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.selected-menu-info h3 {
  background: #f5f5f5;
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.info-card {
  padding: 20px;
  background: white;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.menu-icon-large {
  font-size: 40px;
  margin-right: 15px;
}

.info-title h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.menu-id {
  color: #666;
  font-size: 12px;
}

.info-content p {
  margin: 8px 0;
  color: #666;
  line-height: 1.5;
}
</style>
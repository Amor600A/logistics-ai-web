<template>
  <div class="system-container">
    <!-- 顶部导航栏 -->
    <div class="system-header">
      <h1>物流AI管理系统</h1>
      <div class="user-info">
        <span>欢迎，{{ username }}</span>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </div>

    <div class="system-layout">
      <!-- 左侧垂直菜单 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>功能菜单</h3>
        </div>

        <ul class="vertical-menu">
          <li v-for="item in menuItems" :key="item.id"
            :class="{ active: activeMenu === item.id, 'has-submenu': item.children }" @click="handleMenuClick(item)">
            <div class="menu-item">
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-label">{{ item.label }}</span>
              <span v-if="item.children" class="menu-arrow">
                {{ item.expanded ? '▼' : '▶' }}
              </span>
            </div>

            <!-- 子菜单 -->
            <ul v-if="item.expanded && item.children" class="submenu">
              <li v-for="subItem in item.children" :key="subItem.id" :class="{ active: activeSubMenu === subItem.id }"
                @click.stop="handleSubMenuClick(subItem)">
                <span class="submenu-icon">{{ subItem.icon }}</span>
                <span class="submenu-label">{{ subItem.label }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <div class="content-header">
          <h2>{{ currentPageTitle }}</h2>
          <p>{{ currentPageDescription }}</p>
        </div>

        <div class="content-area">
          <!-- 动态组件切换 -->
          <component :is="currentComponent"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ExtractView from './ExtractView.vue';
import TreeView from './TreeView.vue';
import MenuView from './MenuView.vue';
import HelloWorld from './HelloWorld.vue';

const router = useRouter();
const username = ref('');

// 当前显示的组件
const currentComponent = ref('HelloWorld');

// 菜单数据
const menuItems = reactive([
  {
    id: 'dashboard',
    icon: '🏠',
    label: '系统首页',
    component: HelloWorld,
    description: '系统概览和快捷操作'
  },
  {
    id: 'data',
    icon: '📊',
    label: '数据管理',
    expanded: false,
    children: [
      {
        id: 'extract',
        icon: '📦',
        label: '运单提取',
        component: ExtractView,
        description: '智能提取物流单据信息'
      },
      {
        id: 'tree',
        icon: '🌳',
        label: '树形视图',
        component: TreeView,
        description: '物流数据树形结构展示'
      }
    ]
  },
  {
    id: 'system',
    icon: '⚙️',
    label: '系统设置',
    expanded: false,
    children: [
      {
        id: 'menu',
        icon: '📋',
        label: '菜单管理',
        component: MenuView,
        description: '系统菜单导航管理'
      }
    ]
  }
]);

// 选中状态
const activeMenu = ref('dashboard');
const activeSubMenu = ref('');

// 当前页面信息
const currentPageInfo = computed(() => {
  // 查找当前组件对应的菜单项
  for (const item of menuItems) {
    if (item.component === currentComponent.value) {
      return { title: item.label, description: item.description };
    }
    if (item.children) {
      const subItem = item.children.find(child => child.component === currentComponent.value);
      if (subItem) {
        return { title: subItem.label, description: subItem.description };
      }
    }
  }
  return { title: '物流AI管理系统', description: '欢迎使用智能物流管理系统' };
});

const currentPageTitle = computed(() => currentPageInfo.value.title);
const currentPageDescription = computed(() => currentPageInfo.value.description);

// 获取用户名
onMounted(() => {
  username.value = localStorage.getItem('username') || '用户';
});

// 处理菜单点击
const handleMenuClick = (item) => {
  if (item.children) {
    // 有子菜单，切换展开状态
    item.expanded = !item.expanded;
    if (item.expanded) {
      activeMenu.value = item.id;
    }
  } else {
    // 没有子菜单，切换组件
    activeMenu.value = item.id;
    activeSubMenu.value = '';
    if (item.component) {
      currentComponent.value = item.component;
    }
  }
};

// 处理子菜单点击
const handleSubMenuClick = (item) => {
  activeSubMenu.value = item.id;
  if (item.component) {
    currentComponent.value = item.component;
  }
};

// 退出登录
const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');

  // 跳转到登录页面
  router.push('/login');
};
</script>

<style scoped>
.system-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.system-header {
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.system-header h1 {
  color: #333;
  margin: 0;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #666;
  font-weight: 500;
}

.logout-btn {
  padding: 6px 12px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.logout-btn:hover {
  background: #ff3742;
}

.system-layout {
  display: flex;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

/* 侧边栏样式 */
.sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 900;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.vertical-menu {
  list-style: none;
  padding: 0;
  margin: 0;
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

.menu-icon {
  margin-right: 10px;
  font-size: 16px;
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
  padding: 12px 20px 12px 50px;
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

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 30px;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h2 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.content-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.content-area {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 500px;
  padding: 20px;
}
</style>
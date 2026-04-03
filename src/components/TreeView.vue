<template>
  <div class="tree-container">
    <h1>物流数据树形视图</h1>
    
    <!-- 树形控件 -->
    <div class="tree-area">
      <div class="tree-header">
        <h3>物流数据分类</h3>
        <button @click="expandAll" class="expand-btn">展开全部</button>
        <button @click="collapseAll" class="collapse-btn">折叠全部</button>
      </div>
      
      <div class="tree-content">
        <ul class="tree">
          <li v-for="node in treeData" :key="node.id">
            <div 
              class="tree-node" 
              :class="{ expanded: node.expanded }"
              @click="toggleNode(node)"
            >
              <span class="node-icon">
                {{ node.children ? (node.expanded ? '📂' : '📁') : '📄' }}
              </span>
              <span class="node-label">{{ node.label }}</span>
              <span v-if="node.children" class="node-count">
                ({{ node.children.length }})
              </span>
            </div>
            
            <!-- 子节点 -->
            <ul v-if="node.expanded && node.children" class="tree-children">
              <li v-for="child in node.children" :key="child.id">
                <div class="tree-node child-node">
                  <span class="node-icon">📄</span>
                  <span class="node-label">{{ child.label }}</span>
                  <span v-if="child.value" class="node-value">{{ child.value }}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 选中节点信息 -->
    <div v-if="selectedNode" class="selected-info">
      <h3>选中节点信息</h3>
      <div class="info-content">
        <p><strong>标签：</strong>{{ selectedNode.label }}</p>
        <p v-if="selectedNode.value"><strong>值：</strong>{{ selectedNode.value }}</p>
        <p><strong>ID：</strong>{{ selectedNode.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 树形数据
const treeData = reactive([
  {
    id: '1',
    label: '运单管理',
    expanded: true,
    children: [
      { id: '1-1', label: '待处理运单', value: '15个' },
      { id: '1-2', label: '运输中运单', value: '28个' },
      { id: '1-3', label: '已完成运单', value: '156个' },
      { id: '1-4', label: '异常运单', value: '3个' }
    ]
  },
  {
    id: '2',
    label: '客户管理',
    expanded: false,
    children: [
      { id: '2-1', label: '发货客户', value: '45个' },
      { id: '2-2', label: '收货客户', value: '67个' },
      { id: '2-3', label: 'VIP客户', value: '12个' }
    ]
  },
  {
    id: '3',
    label: '仓库管理',
    expanded: false,
    children: [
      { id: '3-1', label: '入库记录', value: '234条' },
      { id: '3-2', label: '出库记录', value: '189条' },
      { id: '3-3', label: '库存盘点', value: '567件' }
    ]
  },
  {
    id: '4',
    label: '运输管理',
    expanded: false,
    children: [
      { id: '4-1', label: '运输路线', value: '8条' },
      { id: '4-2', label: '车辆管理', value: '15辆' },
      { id: '4-3', label: '司机信息', value: '23人' }
    ]
  }
]);

// 选中节点
const selectedNode = ref(null);

// 切换节点展开/折叠
const toggleNode = (node) => {
  if (node.children) {
    node.expanded = !node.expanded;
  }
  selectedNode.value = node;
};

// 展开所有节点
const expandAll = () => {
  treeData.forEach(node => {
    if (node.children) {
      node.expanded = true;
    }
  });
};

// 折叠所有节点
const collapseAll = () => {
  treeData.forEach(node => {
    if (node.children) {
      node.expanded = false;
    }
  });
};
</script>

<style scoped>
.tree-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
}

.tree-area {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.tree-header {
  background: #f5f5f5;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.tree-header h3 {
  margin: 0;
  color: #333;
}

.expand-btn, .collapse-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.expand-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.collapse-btn:hover {
  background: #fff2e8;
  border-color: #fa8c16;
}

.tree-content {
  padding: 20px;
}

.tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree-node {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 0;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.tree-node:hover {
  background-color: #f0f0f0;
}

.tree-node.expanded {
  background-color: #e6f7ff;
}

.child-node {
  padding-left: 30px;
}

.node-icon {
  margin-right: 8px;
  font-size: 16px;
}

.node-label {
  flex: 1;
  font-weight: 500;
}

.node-count {
  color: #666;
  font-size: 12px;
}

.node-value {
  color: #1890ff;
  font-weight: bold;
  margin-left: 10px;
}

.tree-children {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}

.selected-info {
  margin-top: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.selected-info h3 {
  margin-top: 0;
  color: #333;
}

.info-content p {
  margin: 8px 0;
  color: #666;
}
</style>
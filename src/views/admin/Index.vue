<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">
      欢迎你，管理员 <span class="text-blue-600">{{ username }}</span>
    </h1>

    <ul class="space-y-2 text-gray-700">
      <li><strong>前端框架：</strong> Vue 3 + Composition API + Await 异步模式</li>
      <li><strong>后端框架：</strong> Gin (Go)</li>
      <li><strong>系统架构：</strong> 前后端完全分离</li>
      <li><strong>操作系统：</strong> Ubuntu 20+</li>
      <li><strong>运行方式：</strong> 独立服务进程</li>
      <li><strong>服务器状态：</strong>
        <span :class="status === '正常' ? 'text-green-600' : 'text-red-600'">{{ status }}</span>
      </li>
      <li><strong>服务器域名/IP：</strong> {{ hostname }} [ {{ ip }} ]</li>
    </ul>

    <div class="mt-6 grid grid-cols-2 gap-4">
      <div class="p-4 bg-gray-100 rounded shadow">
        <h3 class="text-lg font-semibold mb-2">Redis 实时数据</h3>
        <p>Total Submitted: {{ redis.submitted }}</p>
        <p>Processed: {{ redis.processed }}</p>
        <p>Processed Last Hour: {{ redis.processed_last_hour }}</p>
        <div ref="redisChartRef" class="mt-4 h-48 w-full"></div>
      </div>

      <div class="p-4 bg-gray-100 rounded shadow">
        <h3 class="text-lg font-semibold mb-2">MySQL 实时数据</h3>
        <p>Written Total: {{ mysql.written_total }}</p>
        <p>Written Last Hour: {{ mysql.written_last_hour }}</p>
        <div ref="mysqlChartRef" class="mt-4 h-48 w-full"></div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t text-sm text-gray-500">
      <p>版本：v-1.0.5</p>
      <p>技术支持：<span class="text-blue-600">日诺科技</span></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import http from '@/http';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
]);

const hostname = ref(window.location.hostname);
const ip = ref('127.0.0.1'); // 可由后端提供真实 IP
const status = ref('加载中...');
const username = ref(localStorage.getItem('username') || '未知用户');

const redis = ref({});
const mysql = ref({});

const redisChartRef = ref(null);
const mysqlChartRef = ref(null);
let redisChartInstance = null;
let mysqlChartInstance = null;

// Store last 60 seconds data
const timeLabels = ref([]);
const redisSubmittedData = ref([]);
const redisProcessedData = ref([]);
const redisProcessedLastHourData = ref([]);
const mysqlWrittenTotalData = ref([]);
const mysqlWrittenLastHourData = ref([]);

const MAX_POINTS = 60;

function addDataPoint(time, submitted, processed, processedLastHour, writtenTotal, writtenLastHour) {
  if (timeLabels.value.length >= MAX_POINTS) {
    timeLabels.value.shift();
    redisSubmittedData.value.shift();
    redisProcessedData.value.shift();
    redisProcessedLastHourData.value.shift();
    mysqlWrittenTotalData.value.shift();
    mysqlWrittenLastHourData.value.shift();
  }
  timeLabels.value.push(time);
  redisSubmittedData.value.push(submitted);
  redisProcessedData.value.push(processed);
  redisProcessedLastHourData.value.push(processedLastHour);
  mysqlWrittenTotalData.value.push(writtenTotal);
  mysqlWrittenLastHourData.value.push(writtenLastHour);
}

function initChart() {
  if (redisChartRef.value) {
    redisChartInstance = echarts.init(redisChartRef.value);
  }
  if (mysqlChartRef.value) {
    mysqlChartInstance = echarts.init(mysqlChartRef.value);
  }
  updateChart();
}

function updateChart() {
  if (redisChartInstance) {
    redisChartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Redis Submitted', 'Redis Processed', 'Redis Processed Last Hour'] },
      xAxis: { type: 'category', data: timeLabels.value, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'Redis Submitted',
          type: 'line',
          data: redisSubmittedData.value,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 123, 255, 0.5)' },
              { offset: 1, color: 'rgba(0, 123, 255, 0)' },
            ]),
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 5,
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
        {
          name: 'Redis Processed',
          type: 'line',
          data: redisProcessedData.value,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(40, 167, 69, 0.5)' },
              { offset: 1, color: 'rgba(40, 167, 69, 0)' },
            ]),
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 5,
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
        {
          name: 'Redis Processed Last Hour',
          type: 'line',
          data: redisProcessedLastHourData.value,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 193, 7, 0.5)' },
              { offset: 1, color: 'rgba(255, 193, 7, 0)' },
            ]),
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 5,
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
      ],
    });
  }

  if (mysqlChartInstance) {
    mysqlChartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['MySQL Written Total', 'MySQL Written Last Hour'] },
      xAxis: { type: 'category', data: timeLabels.value, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'MySQL Written Total',
          type: 'line',
          data: mysqlWrittenTotalData.value,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(40, 167, 69, 0.5)' },
              { offset: 1, color: 'rgba(40, 167, 69, 0)' },
            ]),
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 5,
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
        {
          name: 'MySQL Written Last Hour',
          type: 'line',
          data: mysqlWrittenLastHourData.value,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 99, 132, 0.5)' },
              { offset: 1, color: 'rgba(255, 99, 132, 0)' },
            ]),
          },
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 5,
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
      ],
    });
  }
}

const fetchStatus = async () => {
  try {
    const response = await http('/api/status');
    const res = await response.json();
    status.value = res.code === 200 ? '正常' : '异常';
    if (res.data) {
      redis.value = res.data.redis || {};
      mysql.value = res.data.mysql || {};
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      addDataPoint(
        timeStr,
        redis.value.submitted || 0,
        redis.value.processed || 0,
        redis.value.processed_last_hour || 0,
        mysql.value.written_total || 0,
        mysql.value.written_last_hour || 0
      );
      updateChart();
    }
  } catch (err) {
    status.value = '连接中...';
  }
};

onMounted(() => {
  initChart();
  fetchStatus();
  const intervalId = setInterval(fetchStatus, 10000);
  onBeforeUnmount(() => {
    clearInterval(intervalId);
    if (redisChartInstance) {
      redisChartInstance.dispose();
    }
    if (mysqlChartInstance) {
      mysqlChartInstance.dispose();
    }
  });
});
</script>

<style scoped>
/* Optionally style the chart container */
</style>
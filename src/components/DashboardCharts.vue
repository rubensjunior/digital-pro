<template>
  <div class="dashboard-charts-container mb-8">
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="animate-pulse bg-slate-800 rounded-xl h-64 border border-slate-700/50"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Card: Resumo Rápido -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">Visão Geral</h3>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100/50">
              <span class="text-indigo-500 text-sm font-medium">Ideias Totais</span>
              <div class="text-3xl font-bold text-slate-800 mt-1">{{ stats?.ideasCount || 0 }}</div>
            </div>
            
            <div class="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100/50">
              <span class="text-emerald-500 text-sm font-medium">Workspaces</span>
              <div class="text-3xl font-bold text-slate-800 mt-1">{{ stats?.workspacesCount || 0 }}</div>
            </div>
          </div>
          
          <p class="text-slate-400 text-sm">
            Métricas baseadas no seu ecossistema local e espaços de trabalho.
          </p>
        </div>
        
        <!-- Minichart para preencher espaço vazio, ou ilustração -->
        <div class="mt-4 flex-grow flex items-end">
          <div class="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Card: Ideias por Status (Donut) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center">
        <h3 class="text-slate-800 font-bold text-lg self-start w-full mb-2">Ideias por Status</h3>
        <span class="text-slate-400 text-sm self-start w-full mb-4">Distribuição do fluxo de trabalho</span>
        
        <div class="w-full h-full min-h-[250px] flex items-center justify-center">
          <apexchart 
            v-if="statusChartOptions && statusChartSeries.length"
            type="donut" 
            height="320" 
            :options="statusChartOptions" 
            :series="statusChartSeries"
          ></apexchart>
          <div v-else class="text-slate-400 text-sm">Dados insuficientes</div>
        </div>
      </div>

      <!-- Card: Top Workspaces (Bar) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-slate-800 font-bold text-lg mb-2">Top Workspaces</h3>
        <span class="text-slate-400 text-sm mb-4">Volume de ideias por projeto</span>
        
        <div class="w-full flex-grow min-h-[220px]">
          <apexchart 
            v-if="wsChartOptions && wsChartSeries.length"
            type="bar" 
            height="220" 
            :options="wsChartOptions" 
            :series="wsChartSeries"
          ></apexchart>
          <div v-else class="text-slate-400 text-sm flex items-center justify-center h-full">Dados insuficientes</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Registra o componente globalmente para este escopo
const apexchart = VueApexCharts;

interface StatsData {
  ideasCount: number;
  workspacesCount: number;
  ideasByStatus: { status_name: string; count: number }[];
  ideasByWorkspace: { workspace_name: string; count: number }[];
}

const loading = ref(true);
const stats = ref<StatsData | null>(null);

// Cores premium Metronic inspiradas
const colors = ['#3E97FF', '#F1416C', '#50CD89', '#FFC700', '#7239EA', '#009EF7'];

// Opções para o gráfico de Donut (Status)
const statusChartOptions = computed(() => {
  if (!stats.value || !stats.value.ideasByStatus.length) return null;
  return {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    labels: stats.value.ideasByStatus.map(item => item.status_name),
    colors: colors,
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#A1A5B7'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#181C32'
            },
            total: {
              show: true,
              label: 'Total',
              color: '#A1A5B7',
              fontSize: '14px',
              fontWeight: 600,
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
              }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { 
      show: true, 
      position: 'bottom',
      labels: { colors: '#7E8299' },
      markers: { width: 10, height: 10, radius: 10, offsetX: -2 },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px' },
      y: { formatter: (val: number) => `${val} ideias` }
    }
  };
});

const statusChartSeries = computed(() => {
  return stats.value?.ideasByStatus.map(item => item.count) || [];
});

// Opções para o gráfico de Barras (Workspaces)
const wsChartOptions = computed(() => {
  if (!stats.value || !stats.value.ideasByWorkspace.length) return null;
  return {
    chart: {
      type: 'bar',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false }
    },
    colors: ['#7239EA'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        columnWidth: '40%',
        barHeight: '60%',
        distributed: true
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats.value.ideasByWorkspace.map(item => item.workspace_name),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#7E8299',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    grid: { show: false },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px' },
      y: { formatter: (val: number) => `${val} ideias` }
    }
  };
});

const wsChartSeries = computed(() => {
  if (!stats.value || !stats.value.ideasByWorkspace.length) return [];
  return [{
    name: 'Ideias',
    data: stats.value.ideasByWorkspace.map(item => item.count)
  }];
});

onMounted(async () => {
  try {
    const data = await window.electronAPI.dashboard.getStats();
    stats.value = data;
  } catch (error) {
    console.error('Erro ao carregar métricas:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Ajustes finos do ApexCharts se necessário */
</style>

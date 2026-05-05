<template>
  <div class="dashboard-view p-6 max-w-[1600px] mx-auto w-full">
    <!-- Área de Banners (Supabase) -->
    <AppBanners />

    <!-- Área de Gráficos (ApexCharts) -->
    <DashboardCharts />

    <!-- Base de Conhecimento / Guia de Uso -->
    <div class="mt-8 border-t border-slate-200/60 pt-8">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-800">Base de Conhecimento</h2>
        <p class="text-slate-500 text-sm">Aprenda a utilizar o Digital PRO com nossos guias e templates passo a passo.</p>
      </div>
      <UsageManual />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBanners from '../../components/AppBanners.vue';
import DashboardCharts from '../../components/DashboardCharts.vue';
import UsageManual from '../../components/UsageManual.vue';
</script>

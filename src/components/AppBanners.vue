<template>
  <div class="app-banners-container mb-6">
    <div v-if="loading" class="animate-pulse bg-slate-800/50 rounded-xl h-48 w-full border border-slate-700/50"></div>
    
    <div v-else-if="banners && banners.length > 0" class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
      <a 
        v-for="banner in banners" 
        :key="banner.id" 
        :href="banner.link_url || '#'" 
        target="_blank"
        class="block flex-none w-full sm:w-[80%] md:w-[60%] lg:w-[40%] rounded-xl overflow-hidden snap-center group relative hover:-translate-y-1 transition-all duration-300 ring-1 ring-white/10 hover:ring-indigo-500/50 shadow-lg"
      >
        <img :src="banner.image_url" :alt="banner.title || 'Banner publicidade'" class="w-full h-48 object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <h3 v-if="banner.title" class="text-white font-bold text-lg mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{{ banner.title }}</h3>
          <span v-if="banner.link_url" class="text-indigo-300 text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">Saiba mais &rarr;</span>
        </div>
      </a>
    </div>

    <!-- Fallback / Padrão quando não houver conteúdo -->
    <div v-else class="relative bg-gradient-to-br from-indigo-900 via-slate-800 to-purple-900 rounded-xl p-8 overflow-hidden shadow-2xl border border-white/10">
      <div class="relative z-10 flex flex-col items-start max-w-2xl">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-indigo-500/30">Dica PRO</span>
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        </div>
        <h2 class="text-3xl font-black text-white mb-3 tracking-tight">Maximize seus resultados com o Digital PRO</h2>
        <p class="text-indigo-100/80 mb-6 text-lg max-w-xl leading-relaxed">Sua central definitiva de organização e ideias. Estruture seus lançamentos, crie funis de alta conversão e gerencie todo o seu ecossistema de infoprodutos em um só lugar.</p>
      </div>
      
      <!-- Elementos decorativos de fundo estilo Metronic -->
      <div class="absolute right-0 top-0 w-1/3 h-full overflow-hidden pointer-events-none opacity-40">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="absolute -right-20 -top-20 w-96 h-96 text-indigo-500/20 mix-blend-screen transform rotate-45">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,89.1,-0.5C88.1,15.2,83.6,30.4,75.1,43.2C66.6,56,54.1,66.4,40.1,73.5C26.1,80.6,10.6,84.4,-4.4,81.9C-19.4,79.4,-33.9,70.6,-46.8,61.1C-59.7,51.6,-71,41.4,-78.5,28.6C-86,15.8,-89.7,0.4,-86.6,-13.7C-83.5,-27.8,-73.6,-40.6,-61.5,-49.2C-49.4,-57.8,-35,-62.2,-21.7,-68.4C-8.4,-74.6,3.8,-82.6,18.1,-84C32.4,-85.4,48.7,-80.2,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
}

const banners = ref<Banner[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('app_banners')
      .select('id, title, image_url, link_url')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[AppBanners] Tabela não encontrada ou erro na query:', error.message);
      banners.value = [];
    } else {
      banners.value = data || [];
    }
  } catch (err) {
    console.warn('[AppBanners] Erro de rede ou indisponibilidade (Offline):', err);
    banners.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.app-banners-container .overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.app-banners-container .overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

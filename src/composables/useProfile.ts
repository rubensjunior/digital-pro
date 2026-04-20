import { ref } from 'vue';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  nickname: string;
  profession: string;
  avatar_path: string;
}

const profile = ref<UserProfile>({
  nickname: '',
  profession: '',
  avatar_path: ''
});

const loading = ref(false);

export function useProfile() {
  async function loadProfile() {
    loading.value = true;
    try {
      const data = await window.electronAPI.user.getProfile();
      if (data) {
        profile.value = {
          nickname: data.nickname || '',
          profession: data.profession || '',
          avatar_path: data.avatar_path || ''
        };
      }
    } catch (e) {
      console.error('[useProfile] Erro ao carregar perfil:', e);
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(payload: Partial<UserProfile>) {
    loading.value = true;
    try {
      const newProfile = { ...profile.value, ...payload };
      
      // 1. Atualizar Local (SQLite)
      await window.electronAPI.user.updateProfile({
        nickname: newProfile.nickname,
        profession: newProfile.profession,
        avatarPath: newProfile.avatar_path
      });

      // 2. Sincronizar com Supabase
      if (navigator.onLine) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('clientes').update({
            apelido: newProfile.nickname,
            profissao: newProfile.profession,
            // avatar_url: newProfile.avatar_path // Requer migração na tabela
          }).eq('id', session.user.id);
        }
      }

      profile.value = newProfile;
      return true;
    } catch (e) {
      console.error('[useProfile] Erro ao atualizar perfil:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function syncProfile() {
    if (!navigator.onLine) return;
    loading.value = true;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('clientes')
        .select('apelido, profissao')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.warn('[useProfile] Erro ao sincronizar do Supabase:', error);
        return;
      }

      if (data) {
        // Atualiza Local (SQLite) para persistir a sincronização
        await window.electronAPI.user.updateProfile({
          nickname: data.apelido || '',
          profession: data.profissao || '',
          avatarPath: profile.value.avatar_path // Mantém o avatar local por enquanto
        });

        profile.value = {
          ...profile.value,
          nickname: data.apelido || '',
          profession: data.profissao || ''
        };
      }
    } catch (e) {
      console.error('[useProfile] Falha na sincronização:', e);
    } finally {
      loading.value = false;
    }
  }

  return {
    profile,
    loading,
    loadProfile,
    updateProfile,
    syncProfile
  };
}

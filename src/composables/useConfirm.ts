import { ref } from 'vue';

interface ModalOptions {
  title: string;
  message: string;
  type?: 'primary' | 'danger' | 'success' | 'info' | 'warning';
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  isAlert?: boolean;
}

const show = ref(false);
const options = ref<ModalOptions>({
  title: '',
  message: '',
  type: 'primary',
});

let resolvePromise: (value: boolean) => void;

export function useConfirm() {
  function confirm(opts: ModalOptions): Promise<boolean> {
    options.value = {
      type: 'primary',
      confirmText: opts.isAlert ? 'Entendi' : 'Sim, confirmar',
      cancelText: 'Não, cancelar',
      ...opts
    };
    show.value = true;

    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  }

  function alert(opts: Omit<ModalOptions, 'isAlert'>): Promise<boolean> {
    return confirm({ ...opts, isAlert: true });
  }

  function handleConfirm() {
    show.value = false;
    if (resolvePromise) resolvePromise(true);
  }

  function handleCancel() {
    show.value = false;
    if (resolvePromise) resolvePromise(false);
  }

  return {
    show,
    options,
    confirm,
    alert,
    handleConfirm,
    handleCancel,
  };
}

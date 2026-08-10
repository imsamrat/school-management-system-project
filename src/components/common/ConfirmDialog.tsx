import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      isDestructive ? "bg-red-50 text-red-600" : "bg-primary-50 text-primary-600"
                    )}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 leading-none">
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    disabled={isLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-2 pl-12">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="mt-8 flex justify-end gap-3 pl-12">
                  <button
                    type="button"
                    className="btn-secondary py-2"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2",
                      isDestructive
                        ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                        : "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
                      isLoading && "opacity-70 cursor-not-allowed"
                    )}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {confirmLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

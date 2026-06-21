import { X } from 'lucide-react';

type ErrorPopUpProps = {
  onContinue: () => void;
};

export const ErrorPopUp = ({ onContinue }: ErrorPopUpProps) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-[#fef2f2] p-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-red-500">
              <X className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">Incorreto</p>

          </div>
        </div>
        <button
          onClick={onContinue}
          className="rounded-xl border-b-4 border-red-600 bg-red-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ErrorPopUp;
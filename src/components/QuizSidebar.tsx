import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QuizWidget from '@/components/QuizWidget';

const STORAGE_KEY = 'quiz_sidebar_shown';

export default function QuizSidebar() {
  const [tabVisible, setTabVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      setAutoOpened(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <>
      {!open && tabVisible && (
        <button
          onClick={() => {
            setOpen(true);
            if (!autoOpened) {
              sessionStorage.setItem(STORAGE_KEY, '1');
              setAutoOpened(true);
            }
          }}
          className="fixed right-0 bottom-32 z-50 bg-secondary text-white px-3 py-8 rounded-l-xl shadow-xl hover:bg-secondary/90 transition-all flex flex-col items-center gap-2"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <Icon name="ClipboardList" size={22} className="rotate-90" />
          <span className="text-base font-bold tracking-wide whitespace-nowrap">Подобрать оборудование</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="bg-background border border-border shadow-2xl rounded-2xl w-[94vw] max-w-[680px] max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-lg">Подберём оборудование</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <Icon name="X" size={18} />
              </Button>
            </div>
            <div className="p-5">
              <QuizWidget variant="modal" onClose={() => { setOpen(false); setDismissed(true); }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
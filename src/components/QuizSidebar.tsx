import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QuizWidget from '@/components/QuizWidget';

const STORAGE_KEY = 'quiz_sidebar_shown';

export default function QuizSidebar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-stretch">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-accent text-white px-2 py-6 rounded-l-lg shadow-xl hover:bg-accent/90 transition-all flex flex-col items-center gap-1 animate-fade-in writing-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <Icon name="ClipboardList" size={18} className="rotate-90 mb-1" />
          <span className="text-xs font-bold tracking-wider">ПОДОБРАТЬ</span>
        </button>
      )}

      {open && (
        <div className="bg-background border border-border shadow-2xl rounded-l-xl w-[360px] max-h-[80vh] overflow-y-auto animate-slide-in-right">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-base">Подберём оборудование</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <Icon name="Minus" size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDismissed(true)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <QuizWidget variant="sidebar" onClose={() => setDismissed(true)} />
          </div>
        </div>
      )}
    </div>
  );
}

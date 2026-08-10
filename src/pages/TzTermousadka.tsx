import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const FILE_URL = '/tz-termousadka.txt';

const TzTermousadka = () => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'ТЗ: Термоусадка';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    fetch(FILE_URL)
      .then((r) => r.text())
      .then((t) => {
        setText(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Скопировано', description: 'Текст ТЗ в буфере обмена' });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Icon name="FileText" size={28} className="text-primary mt-1 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold font-heading">
                ТЗ для переноса страницы «Термоусадочное оборудование»
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Служебная страница. Скопируйте текст и вставьте в чат нового проекта.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} disabled={!text}>
              <Icon name="Copy" size={18} className="mr-2" />
              Скопировать весь текст
            </Button>
            <Button variant="outline" asChild>
              <a href={FILE_URL} download="tz-termousadka.txt">
                <Icon name="Download" size={18} className="mr-2" />
                Скачать .txt
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a href={FILE_URL} target="_blank" rel="noreferrer">
                <Icon name="ExternalLink" size={18} className="mr-2" />
                Открыть как файл
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-6">
          {loading ? (
            <p className="text-muted-foreground">Загрузка…</p>
          ) : (
            <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm font-mono leading-relaxed">
              {text}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default TzTermousadka;

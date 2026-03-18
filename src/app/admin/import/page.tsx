
"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { BentoCard } from '@/components/dashboard/bento-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { Database, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ImportPage() {
  const db = useFirestore();
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleImport = async () => {
    if (!jsonInput.trim()) return;

    try {
      setIsImporting(true);
      setStatus('processing');
      const data = JSON.parse(jsonInput);
      
      if (!Array.isArray(data)) {
        throw new Error("O formato deve ser um array de objetos [{}, {}]");
      }

      const total = data.length;
      const batchSize = 500; // Limite do Firestore por lote
      const responsesRef = collection(db, 'surveyResponses');

      for (let i = 0; i < total; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = data.slice(i, i + batchSize);
        
        chunk.forEach((item, index) => {
          // Criamos um ID único para cada resposta ou usamos um existente
          const docId = `resp_${i + index}`;
          const docRef = doc(responsesRef, docId);
          batch.set(docRef, {
            ...item,
            importedAt: new Date().toISOString()
          }, { merge: true });
        });

        await batch.commit();
        const currentProgress = Math.min(((i + batchSize) / total) * 100, 100);
        setProgress(currentProgress);
      }

      setStatus('success');
      toast({
        title: "Importação Concluída",
        description: `${total} entrevistas foram salvas no banco de dados.`,
      });
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Erro na Importação",
        description: error.message || "Verifique se o JSON está correto.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <BentoCard title="Administração" subtitle="Importador Massivo de Dados">
          <div className="space-y-6 mt-4">
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex gap-4">
              <div className="p-3 rounded-xl bg-orange-600 text-white shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900">Segurança de Dados</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Para volumes acima de 100 mil linhas, este importador processa os dados em lotes de 500 registros para evitar sobrecarga no navegador e no banco de dados.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                Cole seu JSON aqui (Array de Objetos)
              </label>
              <Textarea 
                placeholder='[{"Cidade:": "São Luís", ...}, {...}]' 
                className="min-h-[300px] font-mono text-xs p-6 bg-zinc-50 border-zinc-200 rounded-3xl"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                disabled={isImporting}
              />
            </div>

            {isImporting && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400">
                  <span>Processando registros...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={handleImport} 
                disabled={isImporting || !jsonInput}
                className="flex-1 h-14 rounded-2xl premium-gradient text-white font-bold uppercase tracking-widest gap-2"
              >
                {isImporting ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                {isImporting ? 'Importando...' : 'Iniciar Carga no Banco'}
              </Button>
              
              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-6 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={18} />
                  Carga Completa
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <Database size={14} />
                Destino: Firestore / surveyResponses
              </div>
              <p className="text-[10px] font-medium text-zinc-400 italic">
                Aviso: Dados existentes com o mesmo ID serão mesclados.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}

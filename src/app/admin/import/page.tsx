
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { BentoCard } from '@/components/dashboard/bento-card';
import { Button } from '@/components/ui/button';
import { useFirestore, useAuth, useUser } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { Database, FileJson, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ImportPage() {
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, auth]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsImporting(true);
        setStatus('processing');
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          throw new Error("O arquivo deve conter um array de objetos [{}, {}]");
        }

        const total = data.length;
        setTotalToProcess(total);
        const batchSize = 400; // Reduzido ligeiramente para maior estabilidade
        const responsesRef = collection(db, 'surveyResponses');

        for (let i = 0; i < total; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = data.slice(i, i + batchSize);
          
          chunk.forEach((item, index) => {
            // Usamos um ID baseado no índice para evitar duplicatas em caso de retry
            const docId = `survey_${i + index}`;
            const docRef = doc(responsesRef, docId);
            batch.set(docRef, {
              ...item,
              importedAt: new Date().toISOString()
            }, { merge: true });
          });

          try {
            await batch.commit();
            // Pequena pausa para o stream do Firestore respirar entre lotes massivos
            await sleep(50); 
          } catch (serverError: any) {
            const permissionError = new FirestorePermissionError({
              path: 'surveyResponses/batch',
              operation: 'write',
              requestResourceData: { batchCount: chunk.length }
            });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
          }

          const currentProcessed = Math.min(i + batchSize, total);
          setProcessedCount(currentProcessed);
          setProgress((currentProcessed / total) * 100);
        }

        setStatus('success');
        toast({
          title: "Importação Concluída",
          description: `${total} registros foram salvos com sucesso.`,
        });
      } catch (error: any) {
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erro na Importação",
          description: error.message || "Ocorreu um erro ao processar o arquivo.",
        });
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <BentoCard title="Carga de Dados" subtitle="Motor de Importação High-Volume">
          <div className="space-y-8 mt-4">
            <div className="p-6 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex gap-6 items-start">
              <div className="p-4 rounded-2xl bg-orange-600/20 text-orange-500 shrink-0">
                <Database size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white uppercase tracking-widest">Controle de Fluxo Ativo</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Configurado para processar 100k+ registros. O sistema utiliza lotes de 400 registros com intervalos de sincronização para evitar gargalos na conexão Cloud.
                </p>
              </div>
            </div>

            <div 
              onClick={() => !isImporting && fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer
                ${isImporting ? 'opacity-50 cursor-wait' : 'hover:border-orange-500/50 hover:bg-orange-50/10'}
                ${status === 'success' ? 'border-emerald-500/50 bg-emerald-50/5' : 'border-zinc-200'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json"
                disabled={isImporting}
              />
              
              <div className={`p-6 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'premium-gradient'} text-white shadow-2xl`}>
                {isImporting ? <Loader2 className="animate-spin size-8" /> : <FileJson size={32} />}
              </div>
              
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-zinc-900">
                  {isImporting ? 'Sincronizando Banco de Dados...' : status === 'success' ? 'Carga finalizada!' : 'Selecione seu arquivo JSON'}
                </h4>
                <p className="text-xs text-zinc-500 font-medium">
                  {isImporting 
                    ? `Processando ${processedCount.toLocaleString()} de ${totalToProcess.toLocaleString()} entrevistas...` 
                    : 'Clique aqui para carregar o arquivo de 109.000 linhas.'}
                </p>
              </div>
            </div>

            {isImporting && (
              <div className="space-y-4 px-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Stream de Dados Ativo</span>
                  <span className="text-sm font-mono font-bold text-orange-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-zinc-100" />
              </div>
            )}
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}

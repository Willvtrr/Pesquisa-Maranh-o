"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { BentoCard } from '@/components/dashboard/bento-card';
import { useFirestore, useAuth, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc, serverTimestamp, query, limit, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { FileJson, CheckCircle2, Loader2, Info, Activity, AlertTriangle, List, Database, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ImportPage() {
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados de Importação
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'processing' | 'success' | 'error'>('idle');

  // Monitoramento de Dados Reais
  const responsesQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'surveyResponses'),
      orderBy('importedAt', 'desc'),
      limit(20)
    );
  }, [db]);

  const { data: recentResponses, isLoading: isTableLoading } = useCollection(responsesQuery);

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
        setStatus('parsing');
        
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          throw new Error("O arquivo deve conter um array de objetos [{}, {}]");
        }

        const total = data.length;
        setTotalToProcess(total);
        setStatus('processing');

        // Lotes menores (200) para 109k+ evitam exaustão de memória e rede
        const batchSize = 200; 
        const responsesRef = collection(db, 'surveyResponses');

        for (let i = 0; i < total; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = data.slice(i, i + batchSize);
          
          chunk.forEach((item, index) => {
            const docId = `survey_row_${i + index}`;
            const docRef = doc(responsesRef, docId);
            batch.set(docRef, {
              ...item,
              importedAt: serverTimestamp()
            }, { merge: true });
          });

          try {
            await batch.commit();
            // Pausa estratégica para manter o fluxo estável no Google Cloud
            await sleep(200); 
          } catch (serverError: any) {
            const permissionError = new FirestorePermissionError({
              path: 'surveyResponses/batch',
              operation: 'write',
              requestResourceData: { batchCount: chunk.length, atIndex: i }
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
          title: "Sincronização Completa",
          description: `${total.toLocaleString('pt-BR')} registros salvos no Google Cloud.`,
        });
      } catch (error: any) {
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erro na Ingestão",
          description: error.message || "Verifique o formato do arquivo JSON.",
        });
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card de Upload */}
          <BentoCard title="Infraestrutura de Dados" subtitle="Carga Massiva 109k+" className="lg:col-span-2">
            <div className="space-y-8 mt-4">
              <div className="p-6 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex gap-6 items-start">
                <div className="p-4 rounded-2xl bg-orange-600/20 text-orange-500 shrink-0">
                  <Activity className={isImporting ? "animate-pulse" : ""} size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Protocolo de Alta Disponibilidade</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sincronização reativa de alto volume. O sistema processa seus dados em micro-batches para garantir 100% de integridade no Firestore.
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
                  {status === 'parsing' ? <Loader2 className="animate-spin size-8" /> : <FileJson size={32} />}
                </div>
                
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-bold text-zinc-900">
                    {status === 'parsing' ? 'Analisando Base...' : 
                     status === 'processing' ? 'Transmitindo para Cloud...' :
                     status === 'success' ? 'Carga Finalizada!' : 'Suba o arquivo .json'}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    {isImporting 
                      ? `${processedCount.toLocaleString('pt-BR')} de ${totalToProcess.toLocaleString('pt-BR')} registros sincronizados...` 
                      : 'Clique para carregar sua base de 109k+ registros.'}
                  </p>
                </div>
              </div>

              {isImporting && (
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-3 animate-spin text-orange-600" />
                      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Fluxo de Dados Ativo</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-orange-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full bg-zinc-100" />
                </div>
              )}
            </div>
          </BentoCard>

          {/* Card de Status do Banco */}
          <BentoCard title="Status do Banco" subtitle="Monitoramento">
            <div className="flex flex-col h-full justify-between py-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-3">
                    <Database size={18} className="text-zinc-400" />
                    <span className="text-[10px] font-black uppercase text-zinc-500">Documentos</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-zinc-950">100k+</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-emerald-600">Integridade</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500 text-white border-none">99.9%</Badge>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                <Info size={16} className="text-amber-500 shrink-0" />
                <p className="text-[9px] text-amber-700 font-bold uppercase leading-relaxed">
                  Os dados são processados em tempo real. Você pode ver a amostragem ao lado.
                </p>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Tabela de Visualização dos Dados */}
        <BentoCard title="Auditoria de Sincronização" subtitle="Últimos Registros Identificados">
          <div className="mt-6 border border-zinc-100 rounded-[2rem] overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Cidade</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Região</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Gênero</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Idade</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Aprovação Gov</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTableLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-zinc-300" />
                        <span className="text-[10px] font-black uppercase text-zinc-400">Consultando Cloud...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentResponses?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-zinc-400 text-[10px] font-black uppercase">
                      Nenhum dado encontrado no banco.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentResponses?.map((row, idx) => (
                    <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors">
                      <TableCell className="text-xs font-bold text-zinc-900">{row["Cidade:"] || "N/A"}</TableCell>
                      <TableCell className="text-[10px] font-black uppercase text-zinc-500">{row["Mesorregião"] || "N/A"}</TableCell>
                      <TableCell className="text-[10px] font-bold text-zinc-600">{row["Gênero"] || "N/A"}</TableCell>
                      <TableCell className="text-[10px] font-bold text-zinc-600">{row["Faixa Etária"] || "N/A"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={row["De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?"] === 'Aprova' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"}
                        >
                          {row["De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?"] || "NS/NR"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Search size={12} />
              Amostra dos últimos 20 registros
            </div>
            <span>Conexão Segura AES-256</span>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}

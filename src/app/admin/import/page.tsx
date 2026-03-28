"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { BentoCard } from '@/components/dashboard/bento-card';
import { useFirestore, useAuth, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc, serverTimestamp, query, limit, orderBy, getCountFromServer, getDocs } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { FileJson, CheckCircle2, Loader2, Info, Activity, Database, Search, ChevronLeft, ChevronRight, Trash2, AlertTriangle, ListOrdered, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ImportPage() {
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'processing' | 'success' | 'error' | 'clearing'>('idle');
  const [exactDbCount, setExactDbCount] = useState<number | null>(null);

  const [pageSize] = useState(50);

  const refreshExactCount = async () => {
    if (!db) return;
    try {
      const coll = collection(db, 'surveyResponses');
      const snapshot = await getCountFromServer(coll);
      setExactDbCount(snapshot.data().count);
    } catch (e) {
      console.error("Erro ao contar documentos:", e);
    }
  };

  useEffect(() => {
    refreshExactCount();
  }, [db]);

  useEffect(() => {
    if (status === 'success' || status === 'idle') {
      refreshExactCount();
    }
  }, [status]);

  const responsesQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'surveyResponses'),
      orderBy('importedAt', 'desc'),
      limit(pageSize)
    );
  }, [db, pageSize]);

  const { data: recentResponses, isLoading: isTableLoading } = useCollection(responsesQuery);

  const dynamicColumns = useMemo(() => {
    if (!recentResponses || recentResponses.length === 0) return [];
    return Object.keys(recentResponses[0]).filter(key => 
      !['id', 'importedAt', 'INFO'].includes(key)
    );
  }, [recentResponses]);

  useEffect(() => {
    if (!user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, auth]);

  const handleClearDatabase = async () => {
    if (!db) return;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Aguarde",
        description: "Autenticando sessão segura no Google Cloud...",
      });
      return;
    }

    try {
      setIsClearing(true);
      setStatus('clearing');
      setProgress(0);
      setProcessedCount(0);
      
      let deletedCount = 0;
      const initialCount = exactDbCount || 0;
      
      while (true) {
        const q = query(collection(db, 'surveyResponses'), limit(500));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) break;

        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        try {
          await batch.commit();
        } catch (serverError: any) {
          const permissionError = new FirestorePermissionError({
            path: 'surveyResponses/delete_batch',
            operation: 'delete',
          });
          errorEmitter.emit('permission-error', permissionError);
          throw serverError;
        }

        deletedCount += snapshot.size;
        
        if (initialCount > 0) {
          setProgress(Math.min((deletedCount / initialCount) * 100, 100));
        }
        setProcessedCount(deletedCount);
        
        await sleep(150);
      }

      setStatus('idle');
      setExactDbCount(0);
      toast({
        title: "Banco de Dados Resetado",
        description: "Todos os registros foram removidos com sucesso.",
      });
    } catch (error: any) {
      setStatus('error');
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao Limpar",
        description: error.message || "Não foi possível remover os registros.",
      });
    } finally {
      setIsClearing(false);
      setProgress(0);
      refreshExactCount();
    }
  };

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BentoCard title="Infraestrutura de Dados" subtitle="Carga Massiva" className="lg:col-span-2">
            <div className="space-y-8 mt-4">
              <div className="p-6 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-6 items-start">
                  <div className="p-4 rounded-2xl bg-orange-600/20 text-orange-500 shrink-0">
                    <Activity className={isImporting || isClearing ? "animate-pulse" : ""} size={24} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Protocolo de Alta Disponibilidade</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Sincronização reativa. O sistema processa seus dados em micro-batches para garantir integridade.
                    </p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={isImporting || isClearing || !user}
                      className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6"
                    >
                      <Trash2 size={16} className="mr-2" /> 
                      {!user ? 'Autenticando...' : 'Limpar Banco'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem] border-zinc-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-bold tracking-tight">Tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-500 font-medium">
                        Esta ação irá remover permanentemente todos os registros de pesquisa do Firestore. 
                        Isso não pode ser desfeito.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-2xl font-bold">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleClearDatabase}
                        className="rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold"
                      >
                        Sim, apagar tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div 
                onClick={() => !isImporting && !isClearing && fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer
                  ${isImporting || isClearing ? 'opacity-50 cursor-wait' : 'hover:border-orange-500/50 hover:bg-orange-50/10'}
                  ${status === 'success' ? 'border-emerald-500/50 bg-emerald-50/5' : 'border-zinc-200'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".json"
                  disabled={isImporting || isClearing}
                />
                
                <div className={`p-6 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'premium-gradient'} text-white shadow-2xl`}>
                  {status === 'parsing' ? <Loader2 className="animate-spin size-8" /> : 
                   status === 'clearing' ? <Trash2 className="animate-pulse size-8" /> : 
                   <FileJson size={32} />}
                </div>
                
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-bold text-zinc-900">
                    {status === 'parsing' ? 'Analisando Base...' : 
                     status === 'processing' ? 'Transmitindo para Cloud...' :
                     status === 'clearing' ? 'Limpando Registros...' :
                     status === 'success' ? 'Carga Finalizada!' : 'Suba o arquivo .json'}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    {isImporting 
                      ? `${processedCount.toLocaleString('pt-BR')} registros sincronizados...` 
                      : isClearing 
                      ? `Removendo ${processedCount.toLocaleString('pt-BR')} registros da nuvem...`
                      : 'Clique para carregar sua base massiva de registros.'}
                  </p>
                </div>
              </div>

              {(isImporting || isClearing) && (
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-3 animate-spin text-orange-600" />
                      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">
                        {isClearing ? 'Operação de Limpeza Ativa' : 'Fluxo de Dados Ativo'}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-orange-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full bg-zinc-100" />
                </div>
              )}
            </div>
          </BentoCard>

          <div className="space-y-8">
            <BentoCard title="Status do Banco" subtitle="Monitoramento Real">
              <div className="flex flex-col h-full justify-between py-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <Database size={18} className="text-zinc-400" />
                      <span className="text-[10px] font-black uppercase text-zinc-500">Documentos</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-zinc-950">
                      {exactDbCount !== null ? exactDbCount.toLocaleString('pt-BR') : <Loader2 className="animate-spin size-3" />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase text-emerald-600">Integridade</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500 text-white border-none">100% OK</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 mt-6">
                  <Info size={16} className="text-amber-500 shrink-0" />
                  <p className="text-[9px] text-amber-700 font-bold uppercase leading-relaxed">
                    Para evitar duplicados, o sistema usa IDs baseados na posição do arquivo. Use "Limpar Banco" se quiser um reset total.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard title="Dicionário de Variáveis" subtitle="Estrutura do JSON">
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListOrdered size={14} className="text-zinc-400" />
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]">Ordem de Ingestão</span>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none text-[8px] font-black uppercase tracking-widest px-2">
                    {dynamicColumns.length} Colunas
                  </Badge>
                </div>

                <ScrollArea className="h-[280px] -mr-4 pr-4">
                  <div className="space-y-2 pb-4">
                    {dynamicColumns.length > 0 ? dynamicColumns.map((col, idx) => (
                      <div key={col} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-md hover:border-orange-500/20 transition-all group">
                        <div className="w-7 h-7 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-500 transition-all shrink-0 shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-zinc-800 uppercase tracking-tight truncate" title={col}>
                            {col}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Tag size={8} className="text-zinc-300" />
                            <span className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest">Coluna Ativa</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center gap-2 opacity-40">
                        <Search size={24} className="text-zinc-300" />
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-relaxed">
                          Nenhum cabeçalho detectado.<br />Inicie um upload para ver o mapa.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </BentoCard>
          </div>
        </div>

        <BentoCard title="Explorador de Dados" subtitle="Entrevistas Organizadas">
          <div className="mt-6 border border-zinc-100 rounded-[2rem] overflow-hidden bg-white shadow-inner">
            <ScrollArea className="w-full">
              <div className="min-w-[1500px]">
                <Table>
                  <TableHeader className="bg-zinc-50">
                    <TableRow>
                      {dynamicColumns.map((col) => (
                        <TableHead key={col} className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-4">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow>
                        <TableCell colSpan={dynamicColumns.length || 5} className="h-64 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-orange-600 size-8" />
                            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sincronizando Auditoria...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : recentResponses?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={dynamicColumns.length || 5} className="h-32 text-center text-zinc-400 text-[10px] font-black uppercase">
                          Nenhum dado encontrado. Inicie o upload acima.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentResponses?.map((row) => (
                        <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors">
                          {dynamicColumns.map((col) => (
                            <TableCell key={`${row.id}-${col}`} className="text-xs font-medium text-zinc-600 px-4 py-3 border-r border-zinc-50 last:border-none">
                              {typeof row[col] === 'string' && row[col].length > 50 
                                ? <span title={row[col]}>{row[col].substring(0, 50)}...</span>
                                : String(row[col] || "---")
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Search size={12} />
              Total em Nuvem: {exactDbCount?.toLocaleString('pt-BR') || '---'}
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase italic">
                Exibindo registros mais recentes para auditoria rápida
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}

import { useState, useCallback } from 'react';
import { useTrackerStore, TrackerLog, TrackerItem } from '../store/trackerStore';
import { isTaskScheduledForDate } from '../utils/scheduling';

export interface PendingCorrelation {
  item: TrackerItem;
  reason: 'depends_on' | 'triggers';
}

export function useCorrelationGating() {
  const store = useTrackerStore();

  const [pendingCorrelations, setPendingCorrelations] = useState<PendingCorrelation[]>([]);
  const [originalLogRequest, setOriginalLogRequest] = useState<{
    logData: Omit<TrackerLog, 'id' | 'timestamp'>;
    customTimestamp?: number;
    onSuccess?: (logId: string) => void;
  } | null>(null);

  /**
   * Avalia as pendências. Se houver, abre o modal. Senão, salva direto.
   */
  const requestAddLog = useCallback((
    logData: Omit<TrackerLog, 'id' | 'timestamp'>, 
    customTimestamp?: number,
    onSuccess?: (logId: string) => void
  ) => {
    const mainItem = store.items[logData.trackerItemId];
    if (!mainItem) return;

    const targetDate = customTimestamp || Date.now();
    const dateStr = new Date(targetDate).toISOString().split('T')[0];

    // Buscar IDs correlacionados que o item DEPENDE.
    // Dependendo de como modelamos, pode ser "dependsOn" ou apenas chaves em "correlations".
    // Vamos checar todas as chaves em correlations.dependsOn se existir, senão pegamos as chaves diretas do obj.
    let correlatedIds: string[] = [];
    if (mainItem.correlations?.dependsOn && Array.isArray(mainItem.correlations.dependsOn)) {
      correlatedIds = mainItem.correlations.dependsOn;
    } else {
      // Se não for array "dependsOn", pega as keys de correlations ignorando "triggers"
      correlatedIds = Object.keys(mainItem.correlations || {}).filter(k => k !== 'triggers' && k !== 'dependsOn');
    }

    const pending: PendingCorrelation[] = [];

    for (const cId of correlatedIds) {
      const cItem = store.items[cId];
      if (!cItem || cItem.status !== 'ACTIVE') continue;

      // 1. Está na agenda para hoje?
      if (!isTaskScheduledForDate(cItem, targetDate)) {
        continue; // Não precisa validar
      }

      // 2. Já tem log hoje (que não seja um log marcado como "ignored")?
      // O usuário pediu que possamos ignorar a tarefa. 
      // Se tiver uma flag config.ignoreUntil > targetDate, também passa.
      const hasIgnoreFlag = cItem.config?.ignoreUntil && cItem.config.ignoreUntil >= targetDate;
      if (hasIgnoreFlag) continue;

      const logsToday = store.logs.filter(l => {
        if (l.trackerItemId !== cItem.id) return false;
        const lDateStr = new Date(l.timestamp).toISOString().split('T')[0];
        return lDateStr === dateStr;
      });

      // Se não tem logs ou se o log foi marcado com info "Ignorado", podemos precisar checar?
      // Pelo feedback, "Não use Logs, use modais... deixar atualizar a tarefa atual... mas ainda será cobrado nos próximos".
      // Ou seja, não criamos log falso. Apenas passamos reto SE ele clicou ignorar no modal.
      // O ignorar no modal apenas vai "bypassar" a checagem PARA ESTA execução, ou setar um ignore temporário.
      
      if (logsToday.length === 0) {
        pending.push({ item: cItem, reason: 'depends_on' });
      }
    }

    if (pending.length > 0) {
      // Abre o modal de validação
      setPendingCorrelations(pending);
      setOriginalLogRequest({ logData, customTimestamp, onSuccess });
    } else {
      // Pode salvar direto
      const newLogId = store.addLog(logData);
      if (customTimestamp) {
        store.updateLog(newLogId, { timestamp: customTimestamp });
      }
      if (onSuccess) onSuccess(newLogId);
    }
  }, [store]);

  const confirmAndBypass = useCallback(() => {
    if (originalLogRequest) {
      const { logData, customTimestamp, onSuccess } = originalLogRequest;
      const newLogId = store.addLog(logData);
      if (customTimestamp) {
        store.updateLog(newLogId, { timestamp: customTimestamp });
      }
      if (onSuccess) onSuccess(newLogId);
    }
    setPendingCorrelations([]);
    setOriginalLogRequest(null);
  }, [originalLogRequest, store]);

  const cancelRequest = useCallback(() => {
    setPendingCorrelations([]);
    setOriginalLogRequest(null);
  }, []);

  return {
    pendingCorrelations,
    originalItem: originalLogRequest ? store.items[originalLogRequest.logData.trackerItemId] : null,
    requestAddLog,
    confirmAndBypass,
    cancelRequest
  };
}

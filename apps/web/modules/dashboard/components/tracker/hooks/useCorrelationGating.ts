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

      // A correlação precisa ser validada se ainda não foi feita hoje,
      // independente do agendamento isolado dela.
      // O usuário pediu que possamos ignorar a tarefa. 
      // Se tiver uma flag config.ignoreUntil > targetDate, também passa.
      const hasIgnoreFlag = cItem.config?.ignoreUntil && cItem.config.ignoreUntil >= targetDate;
      if (hasIgnoreFlag) continue;

      const logsToday = store.logs.filter(l => {
        if (l.trackerItemId !== cItem.id) return false;
        const lDateStr = new Date(l.timestamp).toISOString().split('T')[0];
        return lDateStr === dateStr;
      });

      const loops = cItem.config?.dailyLoops ?? 1;
      const targetLoops = loops === 'infinite' ? 1 : (typeof loops === 'number' ? loops : 1);

      if (logsToday.length < targetLoops) {
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

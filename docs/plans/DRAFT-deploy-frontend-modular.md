# Estratégia de Deploy: Modularização Frontend Enterprise 🚀

## 🎯 Objetivo
Subir a nova arquitetura do frontend (Unidades REM, Separação de CSS/JS e Service Worker v11) garantindo estabilidade operacional.

## 🛠️ Engrenagens do Plano
1. **Sincronização de Código**: Já realizada via Git (Commit `0e0d8a5`).
2. **Gatilho de Produção**: Disparar o comando `curl` para o UUID do Frontend (`a6n3eh22owgp057dd09t023a`).
3. **Pausa para Auditoria**: Aguardar 180s e solicitar confirmação manual do USER (Smitti).
4. **Telemetria de Saúde**: 
   - Validar `/api/health` para garantir que o backend continua acessível.
   - Validar `/index.html` para confirmar que os novos CSS modulares estão carregando (Status 200).

## ⚠️ Pontos de Atenção
- O Service Worker (v11) pode exigir um "refresh" manual no navegador do usuário para limpar o cache v10.
- Unidades REM dependem do `font-size` base no `theme.css`.

## 📝 Próximo Passo após aprovação:
Executar o gatilho de API e aguardar 180s.

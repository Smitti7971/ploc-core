# 📅 Diário de Bordo: Ajuste Final do PWA e Rich Install UI
**Data**: 2026-05-06
**Responsável**: Antigravity

## 🛠️ O que foi feito?
- **Redimensionamento de Assets**: As screenshots mobile e desktop foram ajustadas para os tamanhos padrão (`390x844` e `1280x800`) usando o script `resize_images.js`.
- **Governança de Deletados**: Os arquivos com dimensões incorretas foram movidos para `/docs/deleteds/2026-05-06/` para fins de auditoria, conforme regra de segurança.
- **Manifesto v1.0.6**: Reversão e fixação dos tamanhos de screenshots no `manifest.json`.
- **Deploy Sincronizado**: Acionamento simultâneo do Backend e Frontend via API para garantir integridade.
- **Documentação**: Criação do guia `docs/guides/pwa.md` e atualização do `MAPA_DO_PROJETO.md`.

## 🧠 Aprendizados e Decisões
- O Chrome exige que a propriedade `sizes` no `manifest.json` corresponda à largura e altura reais do arquivo PNG em pixels, sem margem de erro.
- A biblioteca `Jimp v1` utiliza propriedades curtas (`w` e `h`) para redimensionamento, o que foi corrigido no script de automação.

## 📈 Próximos Passos
- Monitorar a instalação do PWA em dispositivos reais após a propagação do cache.
- Validar a persistência do Service Worker v4.

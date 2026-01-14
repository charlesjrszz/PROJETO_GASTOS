# ⚡ Quick Start - 5 Minutos para Começar

## 🚀 Inicie em 5 Minutos

### Pré-requisito
```bash
npm install
npm start
```

---

## 1️⃣ Deletar Transação (1 min)

### Encontrar o botão
Na tabela, procure pela coluna **"Ações"** na extrema direita

### Clicar em 🗑️
```
Qualquer linha
│ ☐ │ Date │ ... │ Ações   │
│   │      │ ... │ ✏️ 🗑️  │ ← Clique aqui no 🗑️
```

### Confirmar
```
"Tem certeza que deseja deletar esta transação?"
┌──────────────────────────────────┐
│ [OK]  [Cancelar]                 │
└──────────────────────────────────┘
```

✅ **Pronto!** Transação deletada

---

## 2️⃣ Editar Transação (1 min)

### Clicar em ✏️
```
Qualquer linha
│ ☐ │ Date │ ... │ Ações   │
│   │      │ ... │ ✏️ 🗑️  │ ← Clique aqui no ✏️
```

### Modal Abre
```
┌─────────────────────────────┐
│ Editar Transação            │
├─────────────────────────────┤
│ Data: [2025-12-01]          │
│ Descrição: [Seu texto]      │
│ Valor: [150.50]             │
│ Conta: [CC]                 │
│ Categoria: [Alimentação]    │
│                             │
│ [Salvar] [Cancelar]         │
└─────────────────────────────┘
```

### Alterar um campo
Ex: Mudar "Mercado Alves" para "Supermercado XYZ"

### Clicar em Salvar
✅ **Pronto!** Transação atualizada

---

## 3️⃣ Selecionar Múltiplas (1 min)

### Marcar Checkboxes
```
Na coluna mais à esquerda:
☐ ← Clique aqui
  ✓ Após clicar ☑️
```

### Marcar Várias
```
☑️ Transação 1
☑️ Transação 2
☑️ Transação 3
```

### Barra Aparece
```
┌──────────────────────────────────────────────────┐
│ ☑ 3 selecionadas  [✏️ Editar] [🗑️ Deletar] [Cancelar] │
└──────────────────────────────────────────────────┘
```

---

## 4️⃣ Editar Múltiplas (1 min)

### Clicar em ✏️ Editar
Com 3+ transações selecionadas

### Modal "Editar em Massa"
```
┌──────────────────────────────────┐
│ Editar em Massa (3 itens)        │
├──────────────────────────────────┤
│ ☐ Alterar data                   │
│ ☑ Alterar categoria              │
│   [_____________]  ← Digite aqui │
│ ☐ Alterar conta                  │
│                                  │
│ [Aplicar] [Cancelar]             │
└──────────────────────────────────┘
```

### Marcar Campo a Alterar
☑️ "Alterar categoria"

### Preencher Valor
Digite: "Alimentação"

### Clicar em Aplicar
✅ **Pronto!** As 3 transações agora têm categoria "Alimentação"

---

## 5️⃣ Deletar Múltiplas (1 min)

### Com Seleção Ativa
```
☑ 3 selecionadas  [✏️] [🗑️] [Cancelar]
```

### Clicar em 🗑️ Deletar

### Confirmação
```
"Tem certeza que deseja deletar 3 transação(ões)?"
[OK] [Cancelar]
```

### Confirmar
✅ **Pronto!** As 3 transações foram deletadas

---

## 🎯 Atalhos Úteis

| Ação | Como |
|------|------|
| Selecionar Todas | Clicar checkbox do cabeçalho ☑️ |
| Desselecionar Todas | Clicar checkbox do cabeçalho ☑️ novamente |
| Cancelar Seleção | Clicar botão "Cancelar" na barra azul |
| Cancelar Edição | Clicar botão "Cancelar" no modal |
| Cancelar Deleção | Clicar "Cancelar" na confirmação |

---

## 📋 Exemplos Rápidos

### Exemplo 1: Reclassificar 5 Compras
1. ☑️ Marcar 5 transações de supermercado
2. ✏️ Clicar Editar
3. ☑️ Marcar "Alterar categoria"
4. Digite "Alimentação"
5. Aplicar
6. ✅ 5 transações reclassificadas

### Exemplo 2: Remover 3 Transações Duplicadas
1. ☑️ Marcar 3 transações
2. 🗑️ Clicar Deletar
3. OK na confirmação
4. ✅ 3 transações removidas

### Exemplo 3: Corrigir Valor de 1 Transação
1. ✏️ Clicar Editar em uma linha
2. Mudar valor de 150 para 175
3. Clicar Salvar
4. ✅ 1 transação corrigida

---

## 🎨 Interface Cheat Sheet

```
┌─────────────┬────────────────┬──────────────┐
│ AÇÃO        │ ÍCONE/BOTÃO    │ O QUE FODA  │
├─────────────┼────────────────┼──────────────┤
│ Selecionar  │ ☑️ checkbox    │ Marcar linha │
│ Editar Um   │ ✏️ botão       │ Abrir modal  │
│ Deletar Um  │ 🗑️ botão      │ Remover      │
│ Editar vários│ ✏️ (na barra) │ Abrir modal  │
│ Deletar vários│ 🗑️ (na barra) │ Remover     │
│ Confirmar   │ OK / [Salvar]  │ Executar    │
│ Cancelar    │ Cancelar       │ Descartar   │
└─────────────┴────────────────┴──────────────┘
```

---

## ❓ Perguntas Rápidas

**P: Onde está o botão de editar?**  
R: Na coluna "Ações" da tabela (extrema direita)

**P: Como voltar atrás se deltei por erro?**  
R: Recarregue a página (Ctrl+R) **antes** de fechar o app

**P: Posso editar "Data" e "Categoria" ao mesmo tempo?**  
R: Sim! Marque os dois checkboxes no modal de edição em massa

**P: O que acontece se eu deletar sem confirmar?**  
R: Nada. A confirmação é obrigatória

**P: Posso selecionar apenas algumas colunas para editar?**  
R: Sim. Use os checkboxes no modal de edição em massa

**P: Qual é o limite de seleção?**  
R: Nenhum. Você pode selecionar todas as transações

---

## 🔄 Fluxo de Uso Básico

```
COMEÇAR
   ↓
IMPORTAR dados (se necessário)
   ↓
VISUALIZAR transações na tabela
   ↓
SELECIONAR (individual ou múltiplas)
   ├─→ EDITAR (clicar ✏️)
   │   └─→ SALVAR alterações
   │
   └─→ DELETAR (clicar 🗑️)
       └─→ CONFIRMAR exclusão
   ↓
CONTINUAR com outras transações
   ↓
FIM
```

---

## ⚙️ Configuração Inicial

Não há configuração necessária! Tudo funciona "out of the box".

Apenas certifique-se de:
- ✅ Node.js 14+ instalado
- ✅ npm install executado
- ✅ npm start funcionando

---

## 🎓 Próximos Passos

Depois de testar os 5 minutos:

1. **Leia** [README_FUNCIONALIDADES.md](vsls:/README_FUNCIONALIDADES.md) (5 min)
2. **Veja** [GUIA_VISUAL.md](vsls:/GUIA_VISUAL.md) (10 min)
3. **Teste** casos de [GUIA_TESTES.md](vsls:/GUIA_TESTES.md) (30 min)

---

## 💡 Dicas Pro

- 💡 Editar múltiplas transações é **10x mais rápido** que editar uma por uma
- 💡 Use "Selecionar Todas" para operações em toda a lista
- 💡 Sempre confirme deletações para evitar acidentes
- 💡 Combine com filtros para trabalhar com subconjuntos

---

## 🐛 Algo Não Funcionou?

1. Recarregue a página: `Ctrl+R` ou `Cmd+R`
2. Abra DevTools: `Ctrl+Shift+I` ou `Cmd+Option+I`
3. Procure mensagens de erro no console
4. Consulte [GUIA_TESTES.md](vsls:/GUIA_TESTES.md) para troubleshooting

---

**Agora você está pronto! Boa sorte! 🚀**

Próximo passo: Leia [README_FUNCIONALIDADES.md](vsls:/README_FUNCIONALIDADES.md)

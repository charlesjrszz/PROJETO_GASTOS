# 🧪 Guia de Testes das Novas Funcionalidades

## 📋 Índice
1. [Setup Inicial](#setup-inicial)
2. [Testes Básicos](#testes-básicos)
3. [Testes Avançados](#testes-avançados)
4. [Testes de Stress](#testes-de-stress)
5. [Checklist Final](#checklist-final)

---

## Setup Inicial

### Pré-requisitos
- Node.js 14+ instalado
- Electron 14+ instalado
- Dependências do projeto instaladas (`npm install`)

### Executar Aplicativo
```bash
npm start
# ou
npm run start
```

### Acessar DevTools (para debugging)
1. Clique direito na tela → "Inspecionar"
2. Atalho: `Ctrl+Shift+I` ou `Cmd+Option+I` (Mac)

---

## Testes Básicos

### Teste 1.1: Deletar uma Transação Individual
**Objetivo**: Validar que uma transação pode ser deletada com sucesso

**Pré-requisitos**:
- ✅ Aplicativo está aberto
- ✅ Existem transações na tabela

**Passos**:
1. Localizar a primeira transação na tabela
2. Clicar no botão **🗑️ Deletar** da linha
3. Uma caixa de confirmação deve aparecer:
   ```
   "Tem certeza que deseja deletar esta transação?"
   ```
4. Clicar em **OK**

**Resultado Esperado**:
- ✅ A transação desaparece da tabela
- ✅ A contagem de transações diminui
- ✅ Nenhuma mensagem de erro

**Resultado Inesperado**:
- ❌ Transação permanece na tabela
- ❌ Mensagem de erro aparece
- ❌ Aplicativo congela

---

### Teste 1.2: Cancelar Deleção
**Objetivo**: Validar que a deleção pode ser cancelada

**Pré-requisitos**:
- ✅ Existem transações na tabela

**Passos**:
1. Clicar em **🗑️ Deletar** em uma transação
2. Uma caixa de confirmação deve aparecer
3. Clicar em **Cancelar**

**Resultado Esperado**:
- ✅ A confirmação desaparece
- ✅ A transação permanece na tabela
- ✅ Nenhuma alteração

---

### Teste 2.1: Editar uma Transação Individual
**Objetivo**: Validar que os dados de uma transação podem ser editados

**Pré-requisitos**:
- ✅ Existem transações na tabela

**Passos**:
1. Clicar em **✏️ Editar** em uma transação
2. Modal "Editar Transação" deve abrir
3. Alterar o campo **Descrição** de "Mercado" para "Supermercado XYZ"
4. Clicar em **Salvar**

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ A descrição na tabela foi atualizada para "Supermercado XYZ"
- ✅ Todos os outros campos permanecem iguais

---

### Teste 2.2: Editar Múltiplos Campos
**Objetivo**: Validar que múltiplos campos podem ser editados simultaneamente

**Pré-requisitos**:
- ✅ Existem transações na tabela

**Passos**:
1. Clicar em **✏️ Editar** em uma transação
2. Modal abre
3. Modificar:
   - **Data**: de 2025-12-01 para 2025-12-15
   - **Categoria**: de vazio para "Alimentação"
   - **Valor**: de 150.00 para 200.00
4. Clicar em **Salvar**

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ A tabela mostra os novos valores
- ✅ Data, Categoria e Valor foram todos atualizados

---

### Teste 2.3: Cancelar Edição
**Objetivo**: Validar que as mudanças podem ser canceladas

**Pré-requisitos**:
- ✅ Existem transações na tabela

**Passos**:
1. Clicar em **✏️ Editar** em uma transação
2. Modal abre com os dados atuais
3. Alterar a **Descrição**
4. Clicar em **Cancelar**

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ A descrição na tabela permanece inalterada
- ✅ Nenhuma alteração foi persistida

---

### Teste 3.1: Selecionar Uma Transação
**Objetivo**: Validar que checkboxes funcionam

**Pré-requisitos**:
- ✅ Existem transações na tabela

**Passos**:
1. Clicar no checkbox de uma transação (na coluna mais à esquerda)
2. O checkbox deve ficar marcado ☑️
3. A barra de ações deve aparecer no topo com a mensagem "1 selecionada"

**Resultado Esperado**:
- ✅ Checkbox fica marcado
- ✅ Barra azul aparece com "1 selecionada"
- ✅ Botões [✏️ Editar] [🗑️ Deletar] [Cancelar] estão visíveis

---

### Teste 3.2: Selecionar Múltiplas Transações
**Objetivo**: Validar que múltiplas seleções funcionam

**Pré-requisitos**:
- ✅ Existem 3+ transações na tabela

**Passos**:
1. Clicar no checkbox da 1ª transação
2. Clicar no checkbox da 2ª transação
3. Clicar no checkbox da 3ª transação
4. Observar a barra de ações

**Resultado Esperado**:
- ✅ Os 3 checkboxes ficam marcados
- ✅ Barra azul mostra "3 selecionadas"
- ✅ Checkbox do cabeçalho ainda está desmarcado (pois nem todas estão selecionadas)

---

### Teste 3.3: Selecionar Todas
**Objetivo**: Validar que "selecionar todas" funciona

**Pré-requisitos**:
- ✅ Existem 5 transações na tabela
- ✅ Nenhuma está selecionada

**Passos**:
1. Clicar no checkbox do **cabeçalho** (onde está "Data", "Conta", etc.)
2. Observar todos os checkboxes das linhas

**Resultado Esperado**:
- ✅ Todos os 5 checkboxes ficam marcados ☑️
- ✅ Barra azul mostra "5 selecionadas"
- ✅ Checkbox do cabeçalho está marcado ☑️

---

### Teste 3.4: Desselecionar Todas
**Objetivo**: Validar que "desselecionar todas" funciona

**Pré-requisitos**:
- ✅ Todas as 5 transações estão selecionadas

**Passos**:
1. Clicar novamente no checkbox do **cabeçalho**

**Resultado Esperado**:
- ✅ Todos os checkboxes das linhas são desmarcados ☐
- ✅ Barra azul **desaparece**
- ✅ Checkbox do cabeçalho está desmarcado ☐

---

## Testes Avançados

### Teste 4.1: Editar Múltiplas Transações - Alterar Categoria
**Objetivo**: Validar edição em massa de categoria

**Pré-requisitos**:
- ✅ Existem 3 transações sem categoria

**Passos**:
1. Marcar checkboxes das 3 transações
2. Barra azul aparece: "3 selecionadas"
3. Clicar em **✏️ Editar**
4. Modal "Editar em Massa (3 itens)" abre
5. Marcar o checkbox **"Alterar categoria"**
6. Campo de categoria é habilitado (deixa de estar cinzento)
7. Digitar "Alimentação"
8. Clicar em **Aplicar Alterações**

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ Tabela atualiza
- ✅ As 3 transações agora têm "Alimentação" na coluna Categoria
- ✅ Barra de ações desaparece (seleção é limpa)

---

### Teste 4.2: Editar Múltiplas Transações - Sem Campo Selecionado
**Objetivo**: Validar validação quando nenhum campo é selecionado

**Pré-requisitos**:
- ✅ Existem 2 transações selecionadas

**Passos**:
1. Clicar em **✏️ Editar**
2. Modal abre
3. **Não marcar nenhum checkbox**
4. Clicar em **Aplicar Alterações**

**Resultado Esperado**:
- ✅ Um alerta aparece: "Selecione pelo menos um campo para editar"
- ✅ Modal permanece aberto
- ✅ Nenhuma alteração foi feita

---

### Teste 4.3: Editar Múltiplas Transações - Múltiplos Campos
**Objetivo**: Validar edição de múltiplos campos simultaneamente

**Pré-requisitos**:
- ✅ Existem 2 transações selecionadas

**Passos**:
1. Clicar em **✏️ Editar**
2. Modal abre
3. Marcar **"Alterar categoria"** → digitar "Transporte"
4. Marcar **"Alterar conta"** → digitar "Débito"
5. **NÃO marcar** "Alterar data"
6. Clicar em **Aplicar Alterações**

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ As 2 transações têm categoria "Transporte" e conta "Débito"
- ✅ As datas das transações **não foram alteradas**

---

### Teste 5.1: Deletar Múltiplas Transações
**Objetivo**: Validar deleção em massa

**Pré-requisitos**:
- ✅ Existem 5 transações
- ✅ Você selecionou 3 delas

**Passos**:
1. Com 3 transações selecionadas, barra azul mostra "3 selecionadas"
2. Clicar em **🗑️ Deletar**
3. Confirmação aparece: "Tem certeza que deseja deletar 3 transação(ões)?"
4. Clicar em **OK**

**Resultado Esperado**:
- ✅ As 3 transações desaparecem
- ✅ Tabela agora mostra 2 transações (5 - 3 = 2)
- ✅ Barra azul desaparece
- ✅ Todos os checkboxes são desmarcados

---

### Teste 5.2: Cancelar Deleção em Massa
**Objetivo**: Validar cancelamento de deleção em massa

**Pré-requisitos**:
- ✅ Existem 3 transações selecionadas

**Passos**:
1. Clicar em **🗑️ Deletar**
2. Confirmação aparece
3. Clicar em **Cancelar**

**Resultado Esperado**:
- ✅ Confirmação desaparece
- ✅ As 3 transações permanecem na tabela
- ✅ Barra azul ainda está visível
- ✅ As 3 transações permanecem selecionadas

---

### Teste 6.1: Cancelar Seleção com Botão
**Objetivo**: Validar funcionamento do botão "Cancelar" na barra de ações

**Pré-requisitos**:
- ✅ Existem 4 transações selecionadas

**Passos**:
1. Observar barra azul com "4 selecionadas"
2. Clicar em **Cancelar** na barra de ações

**Resultado Esperado**:
- ✅ Todos os 4 checkboxes são desmarcados
- ✅ Barra azul desaparece
- ✅ Checkbox do cabeçalho é desmarcado

---

## Testes de Stress

### Teste 7.1: Muitas Transações
**Objetivo**: Testar performance com muitos registros

**Preparação**:
1. Importar um arquivo com 1000+ transações

**Passos**:
1. Scroll pela tabela
2. Selecionar 50 transações
3. Editar em massa

**Resultado Esperado**:
- ✅ Scroll é suave (sem lag)
- ✅ Seleção múltipla é rápida
- ✅ Edição em massa completa em < 2 segundos

---

### Teste 7.2: Campos Muito Longos
**Objetivo**: Testar com descrições muito longas

**Passos**:
1. Editar uma transação
2. No campo Descrição, colar um texto com 500+ caracteres
3. Salvar

**Resultado Esperado**:
- ✅ O campo aceita o texto longo
- ✅ A tabela exibe o texto sem quebrar o layout
- ✅ A transação é salva com sucesso

---

### Teste 7.3: Caracteres Especiais
**Objetivo**: Testar com caracteres acentuados e especiais

**Passos**:
1. Editar uma transação
2. Descrição: "Açúcar, Café & Pão"
3. Categoria: "Açaí"
4. Conta: "Débito - São Paulo"
5. Salvar

**Resultado Esperado**:
- ✅ Todos os caracteres especiais são salvos
- ✅ A tabela exibe corretamente
- ✅ Filtros funcionam com esses dados

---

## Checklist Final

### ✅ Funcionalidade: Deletar Individual
- [ ] Botão 🗑️ aparece em cada linha
- [ ] Clique em deletar abre confirmação
- [ ] Confirmação "OK" deleta a transação
- [ ] Confirmação "Cancelar" não deleta

### ✅ Funcionalidade: Editar Individual
- [ ] Botão ✏️ aparece em cada linha
- [ ] Clique em editar abre modal
- [ ] Todos os 5 campos são editáveis
- [ ] Clique em "Salvar" persiste as mudanças
- [ ] Clique em "Cancelar" descarta as mudanças
- [ ] Campos não editáveis (currency, balance) são preservados

### ✅ Funcionalidade: Seleção Múltipla
- [ ] Checkboxes aparecem em cada linha
- [ ] Checkbox do cabeçalho aparece
- [ ] Marcar checkbox marca a linha
- [ ] Desmarcar checkbox desmarca a linha
- [ ] Marcar cabeçalho marca todas as linhas
- [ ] Desmarcar cabeçalho desmarca todas as linhas

### ✅ Funcionalidade: Barra de Ações
- [ ] Barra aparece quando há seleção
- [ ] Barra desaparece quando não há seleção
- [ ] Contador de selecionados está correto
- [ ] Botões [✏️ Editar] [🗑️ Deletar] [Cancelar] funcionam

### ✅ Funcionalidade: Edição em Massa
- [ ] Modal abre com contagem correta de itens
- [ ] Checkboxes habilitam/desabilitam campos
- [ ] Apenas campos selecionados são atualizados
- [ ] Clique em "Aplicar Alterações" atualiza dados
- [ ] Clique em "Cancelar" descarta as mudanças
- [ ] Validação rejeita quando nenhum campo está selecionado

### ✅ Funcionalidade: Deleção em Massa
- [ ] Botão 🗑️ na barra de ações funciona
- [ ] Confirmação mostra número correto de itens
- [ ] Clique em "OK" deleta todos os selecionados
- [ ] Clique em "Cancelar" não deleta nada
- [ ] Barra desaparece após deleção

### ✅ UI/UX
- [ ] Interface é responsiva em mobile
- [ ] Interface é responsiva em tablet
- [ ] Interface é responsiva em desktop
- [ ] Cores e ícones são intuitivos
- [ ] Confirmações têm mensagens claras
- [ ] Não há mensagens de erro inesperadas

### ✅ Performance
- [ ] Aplicativo não congela ao deletar
- [ ] Aplicativo não congela ao editar
- [ ] Múltiplas seleções são rápidas
- [ ] Edição em massa é rápida (< 2 seg)

### ✅ Integração
- [ ] Deletar reflete imediatamente na tabela
- [ ] Editar reflete imediatamente na tabela
- [ ] Dados são persistidos em electron-store
- [ ] Recarregar aplicativo mantém dados
- [ ] Filtros funcionam com novos dados

---

## Template de Relatório de Bug

```
TÍTULO: [Área] Descrição breve do problema
SEVERIDADE: [Crítico / Alto / Médio / Baixo]
REPRODUÇÃO:
1. Passo 1
2. Passo 2
3. Passo 3

RESULTADO ESPERADO:
[Descrever o que deveria acontecer]

RESULTADO OBTIDO:
[Descrever o que realmente aconteceu]

PRINTS/LOGS:
[Colar screenshot ou logs de erro]

AMBIENTE:
- SO: Windows 10 / macOS / Linux
- Versão: [versão do app]
- Dados: [quantas transações, etc]
```

---

## Checklist Antes de Versionar (v2.0)

- [ ] Todos os testes básicos passaram
- [ ] Todos os testes avançados passaram
- [ ] Nenhum bug crítico foi encontrado
- [ ] Documentação foi atualizada
- [ ] README foi atualizado
- [ ] Commit foi feito com mensagem clara

---

## Comandos Úteis para Teste

### Limpar dados do teste (reset)
```bash
# Remover dados armazenados
rm -rf ~/.config/[AppName]/  # Linux/Mac
rmdir %APPDATA%\[AppName]\   # Windows
```

### Ver logs em tempo real
```bash
# Terminal 1: Rodando o app
npm start

# Terminal 2: Ver logs
tail -f ~/.config/[AppName]/logs.txt
```

### Abrir DevTools
Dentro da aplicação, pressione `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (Mac)

---

**Desenvolvido em**: Janeiro 2026  
**Última Atualização**: Janeiro 2026  
**Status**: ✅ Pronto para Testes

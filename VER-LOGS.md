# 📋 Como Ver os Logs do Medusa

## 🔍 Métodos para Visualizar Logs

### 1. Logs em Tempo Real (Terminal)

Se o Medusa está rodando em um terminal, os logs aparecem diretamente no terminal.

Para ver logs em tempo real de um processo em background:

```bash
# Ver logs do arquivo em tempo real
tail -f /tmp/medusa-dev.log

# Ou se estiver rodando em background com nohup
tail -f nohup.out
```

### 2. Logs do Arquivo de Log

O Medusa está configurado para salvar logs em `/tmp/medusa-dev.log`:

```bash
# Ver últimas 50 linhas
tail -50 /tmp/medusa-dev.log

# Ver últimas 100 linhas
tail -100 /tmp/medusa-dev.log

# Ver todo o arquivo (cuidado se for muito grande)
cat /tmp/medusa-dev.log

# Procurar por erros
grep -i "error\|failed\|exception" /tmp/medusa-dev.log

# Procurar por warnings
grep -i "warn" /tmp/medusa-dev.log
```

### 3. Logs do Processo em Execução

Se o Medusa está rodando em background:

```bash
# Ver processos do Medusa
ps aux | grep -E "yarn|medusa" | grep -v grep

# Ver logs do processo específico (substitua PID pelo ID do processo)
# Primeiro encontre o PID:
ps aux | grep "yarn dev" | grep -v grep

# Depois veja os logs (se estiver redirecionado)
# Ou use strace para ver atividade (avançado)
```

### 4. Logs via Docker (se estiver usando Docker)

Se o Medusa estiver rodando em Docker:

```bash
# Ver logs do container
docker logs xodozin-medusa

# Ver logs em tempo real
docker logs -f xodozin-medusa

# Ver últimas 100 linhas
docker logs --tail 100 xodozin-medusa

# Ver logs desde um tempo específico
docker logs --since 10m xodozin-medusa
```

### 5. Logs do Sistema (journalctl)

Se estiver rodando como serviço do sistema:

```bash
# Ver logs do systemd (se configurado)
journalctl -u medusa -f

# Ver últimas 100 linhas
journalctl -u medusa -n 100
```

## 🎯 Comandos Úteis

### Ver Logs em Tempo Real
```bash
tail -f /tmp/medusa-dev.log
```

### Filtrar por Tipo de Log
```bash
# Apenas erros
grep -i "error" /tmp/medusa-dev.log | tail -20

# Apenas warnings
grep -i "warn" /tmp/medusa-dev.log | tail -20

# Apenas informações
grep -i "info" /tmp/medusa-dev.log | tail -20
```

### Ver Logs de uma Data/Hora Específica
```bash
# Logs das últimas 10 linhas
tail -10 /tmp/medusa-dev.log

# Logs das últimas 50 linhas com contexto
tail -50 /tmp/medusa-dev.log | less
```

### Procurar por Texto Específico
```bash
# Procurar por "Brasil" nos logs
grep -i "brasil" /tmp/medusa-dev.log

# Procurar por "setup" nos logs
grep -i "setup" /tmp/medusa-dev.log

# Procurar por "user" ou "usuário" nos logs
grep -iE "user|usuário" /tmp/medusa-dev.log
```

### Ver Tamanho do Arquivo de Log
```bash
ls -lh /tmp/medusa-dev.log
```

### Limpar Logs Antigos
```bash
# Limpar o arquivo de log (cuidado!)
> /tmp/medusa-dev.log

# Ou criar backup antes
cp /tmp/medusa-dev.log /tmp/medusa-dev.log.backup
> /tmp/medusa-dev.log
```

## 📊 Monitoramento Contínuo

### Usando `watch` para Monitorar
```bash
# Atualizar a cada 2 segundos
watch -n 2 'tail -20 /tmp/medusa-dev.log'

# Ver apenas erros
watch -n 2 'grep -i "error" /tmp/medusa-dev.log | tail -10'
```

### Usando `multitail` (se instalado)
```bash
# Instalar multitail
sudo apt install multitail

# Ver múltiplos arquivos de log
multitail /tmp/medusa-dev.log
```

## 🔧 Configurar Logs Personalizados

Para configurar onde os logs são salvos, você pode modificar como o Medusa é iniciado:

```bash
# Salvar logs em arquivo específico
cd /home/gabriel/xodozin/xodozin
yarn dev > /caminho/para/logs/medusa.log 2>&1 &

# Ou usar nohup
nohup yarn dev > /caminho/para/logs/medusa.log 2>&1 &
```

## 📝 Estrutura dos Logs

Os logs do Medusa geralmente contêm:
- `[32minfo[39m:` - Informações gerais
- `[33mwarn[39m:` - Avisos
- `[31merror[39m:` - Erros
- `[32mhttp[39m:` - Requisições HTTP
- Timestamps e mensagens de debug

## 🎯 Exemplos Práticos

### Ver se há erros recentes
```bash
tail -100 /tmp/medusa-dev.log | grep -i "error"
```

### Ver todas as requisições HTTP
```bash
grep "http" /tmp/medusa-dev.log | tail -20
```

### Ver logs de inicialização
```bash
grep -i "server is ready\|creating server" /tmp/medusa-dev.log
```

### Ver logs de setup do Brasil
```bash
grep -i "brasil\|setup" /tmp/medusa-dev.log | tail -30
```

### Ver logs de criação de usuários
```bash
grep -i "user\|usuário\|gabriel\|anne" /tmp/medusa-dev.log | tail -20
```

## ⚠️ Dicas

1. **Logs em tempo real**: Use `tail -f` para acompanhar em tempo real
2. **Filtrar erros**: Use `grep -i "error"` para encontrar problemas rapidamente
3. **Tamanho do arquivo**: Monitore o tamanho do arquivo de log para não ocupar muito espaço
4. **Backup**: Faça backup dos logs importantes antes de limpar
5. **Rotação de logs**: Configure rotação de logs para produção


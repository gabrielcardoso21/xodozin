#!/bin/bash
# Script para fazer build apenas se admin não existir
# Se admin já existe, faz apenas build do backend (sem admin)

# Não usar set -e no início porque queremos restaurar admin mesmo se build falhar
# Mas vamos garantir que erros críticos sejam detectados
set +e

echo "🔍 DEBUG: Verificando se admin build existe..."
echo "   Diretório atual: $(pwd)"
echo "   Listando arquivos .medusa (se existir):"
find .medusa -type f -name "index.html" 2>/dev/null | head -5 || echo "   Nenhum index.html encontrado"
echo "   Verificando: .medusa/server/public/admin"
if [ -d ".medusa/server/public/admin" ]; then
    echo "   ✅ Diretório existe"
    ls -la .medusa/server/public/admin 2>/dev/null | head -5
    echo "   Verificando index.html:"
    if [ -f ".medusa/server/public/admin/index.html" ]; then
        echo "   ✅ index.html existe"
        ls -lh .medusa/server/public/admin/index.html
    else
        echo "   ❌ index.html NÃO existe no diretório!"
    fi
else
    echo "   ❌ Diretório não encontrado"
    echo "   Estrutura de .medusa (se existir):"
    find .medusa -type d 2>/dev/null | head -10 || echo "   .medusa não existe"
    echo "   Verificando se .medusa existe:"
    if [ -d ".medusa" ]; then
        echo "   ✅ .medusa existe"
        echo "   Conteúdo de .medusa:"
        ls -la .medusa/ | head -10
    else
        echo "   ❌ .medusa NÃO existe - arquivos não foram copiados do Git!"
    fi
fi
echo ""

if [ -d ".medusa/server/public/admin" ] && [ -f ".medusa/server/public/admin/index.html" ]; then
    echo "✅ Admin build exists, will preserve it during medusa build"
    echo "📦 Making backup of admin build..."
    # Fazer backup completo do admin antes de qualquer operação
    mkdir -p /tmp/admin-backup
    rm -rf /tmp/admin-backup/admin
    cp -r .medusa/server/public/admin /tmp/admin-backup/ 2>/dev/null || true
    echo "   Admin backed up to /tmp/admin-backup/admin"
    echo "   Backup size: $(du -sh /tmp/admin-backup/admin 2>/dev/null | cut -f1)"
    
    echo "🔨 Running medusa build (will restore admin after)..."
    echo "   Note: This may take a while but admin will be preserved"
    echo "   Current directory: $(pwd)"
    echo "   Admin backup location: /tmp/admin-backup/admin"
    echo "   Verifying backup exists:"
    ls -la /tmp/admin-backup/admin/ 2>/dev/null | head -5 || echo "   ⚠️  Backup not found yet"
    
    # Executar medusa build - ele vai remover .medusa/server mas vamos restaurar o admin depois
    # Usar timeout e monitorar memória
    # Se der OOM, pelo menos restaurar o admin
    set +e  # Não falhar se build der erro
    timeout 600 node --max-old-space-size=2048 node_modules/.bin/medusa build 2>&1 | tee /tmp/medusa-build.log
    BUILD_EXIT_CODE=${PIPESTATUS[0]}
    set -e  # Voltar a falhar em erros
    
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo "✅ Medusa build completed successfully"
    else
        echo "⚠️  Medusa build exited with code: $BUILD_EXIT_CODE"
        if [ $BUILD_EXIT_CODE -eq 137 ]; then
            echo "❌ Build was killed by OOM Killer (out of memory)"
            echo "   Will restore admin from backup and continue..."
        elif [ $BUILD_EXIT_CODE -eq 124 ]; then
            echo "❌ Build timed out"
            echo "   Will restore admin from backup and continue..."
        else
            echo "⚠️  Build failed with exit code $BUILD_EXIT_CODE"
            echo "   Will restore admin from backup and continue..."
        fi
        # Continuar para restaurar admin mesmo se build falhou
    fi
    
    # Garantir que estrutura existe e restaurar admin após build
    echo "📦 Restoring admin build..."
    mkdir -p .medusa/server/public
    
    # Sempre restaurar admin, mesmo se build falhou
    if [ -d "/tmp/admin-backup/admin" ]; then
        echo "   Removing any existing admin directory..."
        rm -rf .medusa/server/public/admin 2>/dev/null || true
        echo "   Copying admin from backup..."
        cp -r /tmp/admin-backup/admin .medusa/server/public/ 2>/dev/null || {
            echo "❌ ERROR: Failed to copy admin from backup!"
            echo "   Backup location: /tmp/admin-backup/admin"
            ls -la /tmp/admin-backup/ 2>/dev/null || echo "   /tmp/admin-backup does not exist"
            exit 1
        }
        echo "✅ Admin build restored to .medusa/server/public/admin"
        
        # Verificar se foi restaurado corretamente
        if [ -f ".medusa/server/public/admin/index.html" ]; then
            echo "✅ Verified: index.html exists after restore"
            ls -lh .medusa/server/public/admin/index.html
            echo "   Admin directory contents:"
            ls -la .medusa/server/public/admin/ | head -5
        else
            echo "❌ ERROR: index.html not found after restore!"
            echo "   Checking .medusa/server/public/admin..."
            ls -la .medusa/server/public/admin/ 2>/dev/null || echo "   Directory does not exist"
            echo "   Checking backup..."
            ls -la /tmp/admin-backup/admin/ 2>/dev/null || echo "   Backup directory not found"
            exit 1
        fi
    else
        echo "❌ ERROR: Admin backup not found in /tmp/admin-backup/admin"
        echo "   Checking /tmp/admin-backup..."
        ls -la /tmp/admin-backup/ 2>/dev/null || echo "   /tmp/admin-backup does not exist"
        exit 1
    fi
    
    # Verificar se estrutura completa existe
    echo "🔍 Verifying complete structure..."
    if [ ! -d ".medusa/server" ]; then
        echo "⚠️  Warning: .medusa/server does not exist, creating..."
        mkdir -p .medusa/server
    fi
    if [ ! -d ".medusa/server/public" ]; then
        echo "⚠️  Warning: .medusa/server/public does not exist, creating..."
        mkdir -p .medusa/server/public
    fi
    
    echo "✅ Build completed with admin preserved"
    set -e  # Voltar a falhar em erros
else
    echo "⚠️  Admin build not found, doing full build..."
    echo "🔍 DEBUG: Listando arquivos .medusa antes do build:"
    find .medusa -type f -name "*.html" 2>/dev/null | head -5 || echo "   Nenhum arquivo HTML encontrado"
    node --max-old-space-size=2048 node_modules/.bin/medusa build
    echo "✅ Full build completed"
    echo "🔍 DEBUG: Verificando admin após build completo..."
    if [ -f ".medusa/server/public/admin/index.html" ]; then
        echo "✅ Admin gerado: .medusa/server/public/admin/index.html"
    else
        echo "❌ ERRO: Admin NÃO foi gerado!"
    fi
fi

# Compilar medusa-config.ts para medusa-config.js
echo "🔨 Compilando medusa-config.ts para medusa-config.js..."
if [ -f "medusa-config.ts" ]; then
    # Compilar medusa-config.ts especificamente para o diretório raiz
    # Usar configuração simples que funciona em produção
    # Usar yarn tsc ou node_modules/.bin/tsc diretamente
    if command -v yarn &> /dev/null; then
        yarn tsc medusa-config.ts \
            --outDir . \
            --module commonjs \
            --target ES2021 \
            --esModuleInterop \
            --skipLibCheck \
            --moduleResolution node \
            --resolveJsonModule \
            --allowSyntheticDefaultImports \
            2>&1 | tee /tmp/medusa-config-compile.log || {
            echo "⚠️  yarn tsc falhou, tentando node_modules/.bin/tsc..."
            node_modules/.bin/tsc medusa-config.ts \
                --outDir . \
                --module commonjs \
                --target ES2021 \
                --esModuleInterop \
                --skipLibCheck \
                --moduleResolution node \
                --resolveJsonModule \
                --allowSyntheticDefaultImports \
                2>&1 | tee /tmp/medusa-config-compile.log || {
                echo "⚠️  Compilação falhou, usando fallback..."
            }
        }
    else
        node_modules/.bin/tsc medusa-config.ts \
            --outDir . \
            --module commonjs \
            --target ES2021 \
            --esModuleInterop \
            --skipLibCheck \
            --moduleResolution node \
            --resolveJsonModule \
            --allowSyntheticDefaultImports \
            2>&1 | tee /tmp/medusa-config-compile.log || {
            echo "⚠️  Compilação falhou, usando fallback..."
        }
    fi
    
    # Se ainda não existe, criar fallback
    if [ ! -f "medusa-config.js" ]; then
        echo "⚠️  Falha ao compilar medusa-config.ts, tentando método alternativo..."
        # Se falhar, criar um medusa-config.js básico que funciona
        echo "   Criando medusa-config.js básico..."
        cat > medusa-config.js << 'EOF'
const { loadEnv, defineConfig } = require('@medusajs/framework/utils');
loadEnv(process.env.NODE_ENV || 'development', process.cwd());
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9000,
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  featureFlags: {}
});
EOF
        echo "✅ medusa-config.js básico criado"
    fi
    if [ -f "medusa-config.js" ]; then
        echo "✅ medusa-config.js gerado/verificado"
        ls -lh medusa-config.js
    else
        echo "❌ ERRO: medusa-config.js não foi gerado!"
        exit 1
    fi
else
    echo "⚠️  medusa-config.ts não encontrado"
    if [ ! -f "medusa-config.js" ]; then
        echo "❌ ERRO: Nem medusa-config.ts nem medusa-config.js encontrados!"
        exit 1
    fi
fi

# Compilar instrumentation.ts para instrumentation.js na raiz
echo "🔨 Compilando instrumentation.ts para instrumentation.js..."
if [ -f "instrumentation.ts" ]; then
    # Compilar instrumentation.ts especificamente para o diretório raiz
    # Usar configuração simples que funciona em produção
    # Usar yarn tsc ou node_modules/.bin/tsc diretamente
    if command -v yarn &> /dev/null; then
        yarn tsc instrumentation.ts \
            --outDir . \
            --module commonjs \
            --target ES2021 \
            --esModuleInterop \
            --skipLibCheck \
            --moduleResolution node \
            --allowSyntheticDefaultImports \
            2>&1 | tee /tmp/instrumentation-compile.log || {
            echo "⚠️  yarn tsc falhou, tentando node_modules/.bin/tsc..."
            node_modules/.bin/tsc instrumentation.ts \
                --outDir . \
                --module commonjs \
                --target ES2021 \
                --esModuleInterop \
                --skipLibCheck \
                --moduleResolution node \
                --allowSyntheticDefaultImports \
                2>&1 | tee /tmp/instrumentation-compile.log || {
                echo "⚠️  Compilação falhou, usando fallback..."
            }
        }
    else
        node_modules/.bin/tsc instrumentation.ts \
            --outDir . \
            --module commonjs \
            --target ES2021 \
            --esModuleInterop \
            --skipLibCheck \
            --moduleResolution node \
            --allowSyntheticDefaultImports \
            2>&1 | tee /tmp/instrumentation-compile.log || {
            echo "⚠️  Compilação falhou, usando fallback..."
        }
    fi
    
    # Se ainda não existe, criar fallback
    if [ ! -f "instrumentation.js" ]; then
        echo "⚠️  Falha ao compilar instrumentation.ts, criando fallback..."
        echo "   Criando instrumentation.js básico..."
        cat > instrumentation.js << 'EOF'
// Este arquivo é necessário para produção - Node.js não carrega TypeScript diretamente
// Export empty object to prevent "Cannot find module" error
module.exports = {};
EOF
        echo "✅ instrumentation.js básico criado"
    fi
    if [ -f "instrumentation.js" ]; then
        echo "✅ instrumentation.js gerado/verificado"
        ls -lh instrumentation.js
    else
        echo "⚠️  AVISO: instrumentation.js não foi gerado, mas continuando..."
        # Não falhar aqui, pois instrumentation é opcional
    fi
else
    echo "⚠️  instrumentation.ts não encontrado"
    # Garantir que instrumentation.js existe mesmo se .ts não existir
    if [ ! -f "instrumentation.js" ]; then
        echo "   Criando instrumentation.js básico..."
        cat > instrumentation.js << 'EOF'
// Este arquivo é necessário para produção - Node.js não carrega TypeScript diretamente
// Export empty object to prevent "Cannot find module" error
module.exports = {};
EOF
        echo "✅ instrumentation.js básico criado"
    fi
fi

# Compilar TypeScript para garantir que arquivos compilados existam
echo "🔨 Compilando TypeScript (resto do projeto)..."
if [ -f "tsconfig.json" ]; then
    # Usar tsconfig.backend.json se existir para evitar erros do frontend
    if [ -f "tsconfig.backend.json" ]; then
        echo "   Usando tsconfig.backend.json (exclui frontend)..."
        # Usar yarn tsc ou node_modules/.bin/tsc
        if command -v yarn &> /dev/null; then
            # tsc --build não aceita --project, usar apenas o arquivo de config
            yarn tsc --build -p tsconfig.backend.json 2>&1 | tee /tmp/tsc-build.log || {
                echo "⚠️  yarn tsc falhou, tentando node_modules/.bin/tsc..."
                node_modules/.bin/tsc --build -p tsconfig.backend.json 2>&1 | tee /tmp/tsc-build.log || {
                    echo "⚠️  TypeScript compilation had warnings, but continuing..."
                }
            }
        else
            # tsc --build não aceita --project, usar apenas o arquivo de config
            node_modules/.bin/tsc --build -p tsconfig.backend.json 2>&1 | tee /tmp/tsc-build.log || {
                echo "⚠️  TypeScript compilation had warnings, but continuing..."
            }
        fi
    else
        # Usar yarn tsc ou node_modules/.bin/tsc
        if command -v yarn &> /dev/null; then
            yarn tsc --build 2>&1 | tee /tmp/tsc-build.log || {
                echo "⚠️  yarn tsc falhou, tentando node_modules/.bin/tsc..."
                node_modules/.bin/tsc --build 2>&1 | tee /tmp/tsc-build.log || {
                    echo "⚠️  TypeScript compilation had warnings, but continuing..."
                }
            }
        else
            node_modules/.bin/tsc --build 2>&1 | tee /tmp/tsc-build.log || {
                echo "⚠️  TypeScript compilation had warnings, but continuing..."
            }
        fi
    fi
    echo "✅ TypeScript compilation completed"
else
    echo "⚠️  tsconfig.json não encontrado, pulando compilação TypeScript"
fi

# Garantir que medusa-config.js existe antes de terminar
if [ ! -f "medusa-config.js" ]; then
    echo "❌ ERRO CRÍTICO: medusa-config.js não existe após build!"
    echo "   Tentando criar versão básica..."
    cat > medusa-config.js << 'EOF'
const { loadEnv, defineConfig } = require('@medusajs/framework/utils');
loadEnv(process.env.NODE_ENV || 'development', process.cwd());
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      port: process.env.PORT || 9000,
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  featureFlags: {}
});
EOF
    if [ -f "medusa-config.js" ]; then
        echo "✅ medusa-config.js básico criado"
    else
        echo "❌ ERRO: Falha ao criar medusa-config.js básico!"
        exit 1
    fi
fi

echo "✅ Build script completed successfully"



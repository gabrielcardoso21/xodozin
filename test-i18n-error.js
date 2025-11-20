const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testI18nError() {
  console.log('🔍 Verificando se o erro de i18n foi resolvido...\n');
  
  const containerName = 'xodozin-medusa';
  
  try {
    // Verificar se o container está rodando
    console.log('1️⃣ Verificando se o container está rodando...');
    try {
      const { stdout: psOutput } = await execPromise(`docker ps --filter name=${containerName} --format "{{.Names}}"`);
      if (!psOutput.trim().includes(containerName)) {
        console.log('❌ Container não está rodando. Iniciando...');
        await execPromise(`docker-compose up -d medusa`);
        console.log('⏳ Aguardando 10 segundos para o container iniciar...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        console.log('✅ Container está rodando');
      }
    } catch (error) {
      console.log('⚠️  Erro ao verificar container:', error.message);
    }
    
    // Verificar se o arquivo i18n existe no container
    console.log('\n2️⃣ Verificando se o arquivo i18n existe no container...');
    try {
      const { stdout: fileCheck } = await execPromise(
        `docker exec ${containerName} sh -c "test -f /app/src/admin/i18n/index.ts && echo 'EXISTS' || echo 'NOT_FOUND'"`
      );
      
      if (fileCheck.trim() === 'EXISTS') {
        console.log('✅ Arquivo /app/src/admin/i18n/index.ts existe');
        
        // Verificar conteúdo do arquivo
        const { stdout: fileContent } = await execPromise(
          `docker exec ${containerName} cat /app/src/admin/i18n/index.ts`
        );
        console.log('📄 Conteúdo do arquivo:');
        console.log(fileContent);
      } else {
        console.log('❌ Arquivo /app/src/admin/i18n/index.ts NÃO encontrado');
        console.log('⚠️  Tentando copiar arquivos para o container...');
        
        // Tentar copiar os arquivos
        await execPromise(`docker cp xodozin/src/admin/i18n ${containerName}:/app/src/admin/`);
        console.log('✅ Arquivos copiados');
      }
    } catch (error) {
      console.log('⚠️  Erro ao verificar arquivo:', error.message);
    }
    
    // Verificar logs recentes para erros de i18n
    console.log('\n3️⃣ Verificando logs recentes para erros de i18n...');
    try {
      const { stdout: logs } = await execPromise(
        `docker logs ${containerName} --tail 100 2>&1`
      );
      
      const i18nErrors = logs.split('\n').filter(line => 
        line.includes('i18n') || 
        line.includes('Failed to resolve import') ||
        line.includes('virtual:medusa/i18n')
      );
      
      if (i18nErrors.length > 0) {
        console.log('⚠️  Erros relacionados a i18n encontrados nos logs:');
        i18nErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      } else {
        console.log('✅ Nenhum erro de i18n encontrado nos logs recentes');
      }
    } catch (error) {
      console.log('⚠️  Erro ao verificar logs:', error.message);
    }
    
    // Monitorar logs em tempo real por 30 segundos
    console.log('\n4️⃣ Monitorando logs em tempo real por 30 segundos...');
    console.log('   (Procurando por erros de i18n)\n');
    
    const monitorDuration = 30000; // 30 segundos
    const startTime = Date.now();
    let errorFound = false;
    let errorMessages = [];
    
    const logProcess = exec(`docker logs ${containerName} -f --tail 0 2>&1`);
    
    logProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.includes('i18n') || 
            line.includes('Failed to resolve import') ||
            line.includes('virtual:medusa/i18n') ||
            line.includes('/src/admin/i18n/index.ts')) {
          if (!errorFound) {
            errorFound = true;
            console.log('⚠️  Erro de i18n detectado:');
          }
          console.log(`   ${line}`);
          errorMessages.push(line);
        }
      });
    });
    
    logProcess.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.includes('i18n') || 
            line.includes('Failed to resolve import') ||
            line.includes('virtual:medusa/i18n')) {
          if (!errorFound) {
            errorFound = true;
            console.log('⚠️  Erro de i18n detectado:');
          }
          console.log(`   ${line}`);
          errorMessages.push(line);
        }
      });
    });
    
    // Aguardar o tempo de monitoramento
    await new Promise(resolve => setTimeout(resolve, monitorDuration));
    
    // Parar o monitoramento
    logProcess.kill();
    
    // Resultado final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADO DO TESTE');
    console.log('='.repeat(60));
    
    if (errorFound) {
      console.log('❌ ERRO DE I18N AINDA PRESENTE');
      console.log(`   Total de erros encontrados: ${errorMessages.length}`);
      console.log('\n   Erros detectados:');
      errorMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg.substring(0, 100)}...`);
      });
      process.exit(1);
    } else {
      console.log('✅ NENHUM ERRO DE I18N DETECTADO');
      console.log('✅ O problema parece estar resolvido!');
      console.log('\n💡 Próximos passos:');
      console.log('   1. Acesse o Admin Panel em http://localhost:9000/app');
      console.log('   2. Verifique se a interface está funcionando');
      console.log('   3. Configure o idioma português nas configurações');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.message);
    process.exit(1);
  }
}

// Executar o teste
testI18nError();


const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Iniciando teste do Admin Panel...\n');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar erros do console
  const consoleErrors = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });
  
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });
  
  try {
    console.log('📡 Acessando Admin Panel...');
    await page.goto('http://localhost:9000/app', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('⏳ Aguardando 10 segundos para carregar completamente...');
    await page.waitForTimeout(10000);
    
    // Verificar se a página carregou
    const title = await page.title();
    console.log(`📄 Título da página: ${title}`);
    
    // Verificar se há elemento do Admin Panel
    const hasMedusaElement = await page.locator('#medusa').count() > 0;
    console.log(`🎯 Elemento #medusa encontrado: ${hasMedusaElement ? '✅ Sim' : '❌ Não'}`);
    
    // Verificar erros de WebSocket
    const websocketErrors = consoleErrors.filter(err => 
      err.includes('WebSocket') || 
      err.includes('websocket') || 
      err.includes('ws://') ||
      err.includes('ERR_CONNECTION_REFUSED')
    );
    
    // Verificar erros de i18n
    const i18nErrors = consoleErrors.filter(err => 
      err.includes('i18n') || 
      err.includes('Failed to resolve import')
    );
    
    // Verificar erros de rede relacionados a WebSocket
    const websocketNetworkErrors = networkErrors.filter(err => 
      err.url.includes('ws://') || 
      err.failure.includes('ERR_CONNECTION_REFUSED')
    );
    
    console.log('\n📊 Resultados do Teste:');
    console.log('='.repeat(50));
    
    // Erros de WebSocket
    if (websocketErrors.length > 0) {
      console.log('❌ Erros de WebSocket encontrados:');
      websocketErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 100)}...`);
      });
    } else {
      console.log('✅ Nenhum erro de WebSocket encontrado!');
    }
    
    // Erros de rede WebSocket
    if (websocketNetworkErrors.length > 0) {
      console.log('\n❌ Erros de rede WebSocket encontrados:');
      websocketNetworkErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.url} - ${err.failure}`);
      });
    } else {
      console.log('✅ Nenhum erro de rede WebSocket encontrado!');
    }
    
    // Erros de i18n
    if (i18nErrors.length > 0) {
      console.log('\n⚠️  Erros de i18n encontrados (não críticos):');
      i18nErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 100)}...`);
      });
    } else {
      console.log('✅ Nenhum erro de i18n encontrado!');
    }
    
    // Todos os erros
    if (consoleErrors.length > 0) {
      console.log(`\n📋 Total de erros no console: ${consoleErrors.length}`);
      console.log('Primeiros 5 erros:');
      consoleErrors.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 150)}...`);
      });
    } else {
      console.log('\n✅ Nenhum erro no console!');
    }
    
    // Status final
    console.log('\n' + '='.repeat(50));
    const hasWebsocketErrors = websocketErrors.length > 0 || websocketNetworkErrors.length > 0;
    const pageLoaded = hasMedusaElement || title !== '';
    
    if (!hasWebsocketErrors && pageLoaded) {
      console.log('✅ TESTE PASSOU: Admin Panel funcionando sem erros de WebSocket!');
      process.exit(0);
    } else if (hasWebsocketErrors) {
      console.log('❌ TESTE FALHOU: Ainda há erros de WebSocket!');
      process.exit(1);
    } else if (!pageLoaded) {
      console.log('❌ TESTE FALHOU: Admin Panel não carregou!');
      process.exit(1);
    } else {
      console.log('⚠️  TESTE INCONCLUSIVO: Verifique manualmente');
      process.exit(2);
    }
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();


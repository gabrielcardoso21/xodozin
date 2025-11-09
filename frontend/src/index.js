import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

console.log('[React Init] Iniciando aplicação React');
console.log('[React Init] document.body existe?', !!document.body);
console.log('[React Init] document.head existe?', !!document.head);
console.log('[React Init] document.getElementById("root") existe?', !!document.getElementById("root"));

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[React Init] ERRO: elemento #root não encontrado!');
  console.error('[React Init] document.body:', document.body);
  console.error('[React Init] document.body.innerHTML:', document.body?.innerHTML);
} else {
  console.log('[React Init] Elemento #root encontrado:', rootElement);
  console.log('[React Init] #root.innerHTML antes do render:', rootElement.innerHTML);
  console.log('[React Init] #root.children antes do render:', rootElement.children.length);
}

const root = ReactDOM.createRoot(rootElement);

console.log('[React Init] ReactDOM.createRoot criado');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log('[React Init] root.render() chamado');

// Monitora mudanças no DOM
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        console.log('[DOM Monitor] Mudança detectada no DOM:');
        console.log('[DOM Monitor] - Tipo:', mutation.type);
        console.log('[DOM Monitor] - Target:', mutation.target);
        console.log('[DOM Monitor] - Removidos:', mutation.removedNodes.length, 'nós');
        console.log('[DOM Monitor] - Adicionados:', mutation.addedNodes.length, 'nós');
        
        if (mutation.removedNodes.length > 0) {
          console.log('[DOM Monitor] NÓS REMOVIDOS:');
          Array.from(mutation.removedNodes).forEach(function(node, index) {
            console.log(`[DOM Monitor]   [${index}]`, node.nodeName, node.nodeType, node);
            if (node.nodeType === 1) { // Element node
              console.log(`[DOM Monitor]     - id:`, node.id);
              console.log(`[DOM Monitor]     - class:`, node.className);
              console.log(`[DOM Monitor]     - innerHTML:`, node.innerHTML?.substring(0, 100));
            }
          });
        }
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    console.log('[DOM Monitor] MutationObserver iniciado para monitorar mudanças no DOM');
  } else {
    console.warn('[DOM Monitor] document.body não existe, MutationObserver não iniciado');
  }
}

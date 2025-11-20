import { Resend } from "resend";

/**
 * Serviço de email usando Resend
 * 
 * Configuração necessária:
 * - RESEND_API_KEY: API key do Resend (obter em https://resend.com)
 * - RESEND_FROM_EMAIL: Email remetente (ex: vendas@xodozin.com.br)
 * - COMPANY_NAME: Nome da empresa (para templates)
 */

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@xodozin.com.br";
const companyName = process.env.COMPANY_NAME || "Xodózin";

let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY não configurado. Emails não serão enviados.");
}

/**
 * Template de email de confirmação de pagamento
 */
function getPaymentConfirmationEmailTemplate(order: any): string {
  const orderTotal = (order.total || 0) / 100; // Converter de centavos para reais
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(orderTotal);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Confirmado - ${companyName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Pagamento Confirmado!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Olá <strong>${order.shipping_address?.first_name || "Cliente"}</strong>,
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Seu pagamento foi confirmado com sucesso! 🎉
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea;">Detalhes do Pedido</h2>
      <p style="margin: 10px 0;"><strong>Número do Pedido:</strong> ${order.display_id || order.id}</p>
      <p style="margin: 10px 0;"><strong>Valor Total:</strong> ${formattedTotal}</p>
      <p style="margin: 10px 0;"><strong>Data:</strong> ${new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Estamos preparando seu pedido com muito carinho! 💝
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Em breve você receberá um email com sua nota fiscal.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 14px; color: #666;">
        Se tiver alguma dúvida, entre em contato conosco.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Template de email com NFe
 */
function getNFeEmailTemplate(order: any): string {
  const nfeKey = order.metadata?.nfe_key || "";
  const nfeNumber = order.metadata?.nfe_number || "";
  const nfeUrl = order.metadata?.nfe_url || "";
  const orderTotal = (order.total || 0) / 100;
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(orderTotal);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nota Fiscal Disponível - ${companyName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📄 Nota Fiscal Disponível</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Olá <strong>${order.shipping_address?.first_name || "Cliente"}</strong>,
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Sua nota fiscal foi emitida e está disponível para download! 📋
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea;">Informações da Nota Fiscal</h2>
      <p style="margin: 10px 0;"><strong>Número do Pedido:</strong> ${order.display_id || order.id}</p>
      <p style="margin: 10px 0;"><strong>Número da NFe:</strong> ${nfeNumber}</p>
      <p style="margin: 10px 0;"><strong>Chave de Acesso:</strong> ${nfeKey}</p>
      <p style="margin: 10px 0;"><strong>Valor Total:</strong> ${formattedTotal}</p>
    </div>
    
    ${nfeUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${nfeUrl}" 
         style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        📥 Baixar Nota Fiscal
      </a>
    </div>
    ` : ""}
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        <strong>💡 Importante:</strong> Guarde esta nota fiscal para seus registros. 
        A chave de acesso pode ser consultada no site da Receita Federal.
      </p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Obrigado por escolher ${companyName}! 💝
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Enviar email de confirmação de pagamento
 */
export async function sendPaymentConfirmationEmail(order: any): Promise<void> {
  if (!resend) {
    console.warn("Resend não configurado. Email de confirmação de pagamento não enviado.");
    return;
  }

  const customerEmail = order.email || order.shipping_address?.email;
  if (!customerEmail) {
    console.warn(`Email do cliente não encontrado para pedido ${order.id}`);
    return;
  }

  try {
    const html = getPaymentConfirmationEmailTemplate(order);
    
    await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `✅ Pagamento Confirmado - Pedido #${order.display_id || order.id}`,
      html,
    });

    console.log(`✅ Email de confirmação de pagamento enviado para ${customerEmail}`);
  } catch (error: any) {
    console.error(`❌ Erro ao enviar email de confirmação de pagamento:`, error);
    throw error;
  }
}

/**
 * Enviar email com NFe
 */
export async function sendNFeEmail(order: any): Promise<void> {
  if (!resend) {
    console.warn("Resend não configurado. Email de NFe não enviado.");
    return;
  }

  const customerEmail = order.email || order.shipping_address?.email;
  if (!customerEmail) {
    console.warn(`Email do cliente não encontrado para pedido ${order.id}`);
    return;
  }

  if (!order.metadata?.nfe_key) {
    console.warn(`NFe não encontrada no pedido ${order.id}`);
    return;
  }

  try {
    const html = getNFeEmailTemplate(order);
    
    await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `📄 Nota Fiscal Disponível - Pedido #${order.display_id || order.id}`,
      html,
    });

    console.log(`✅ Email de NFe enviado para ${customerEmail}`);
  } catch (error: any) {
    console.error(`❌ Erro ao enviar email de NFe:`, error);
    throw error;
  }
}


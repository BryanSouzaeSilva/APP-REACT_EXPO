import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

const gerarHtmlRecibo = (venda) => {
        const itensHtml = venda.itens.map(item => `
            <tr>
                <td style="padding: 5px 0;">${item.quantity} un</td>
                <td style="padding: 5px 0;">${item.nome}</td>
                <td style="text-align: right; padding: 5px 0;">R$ ${(item.valor * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .title { font-size: 24px; font-weight: bold; }
                    .subtitle { font-size: 14px; color: #555; }
                    .divider { border-bottom: 1px dashed #ccc; margin: 10px 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    
                    th { text-align: left; border-bottom: 2px solid #333; padding-bottom: 5px; font-size: 14px; text-transform: uppercase; }
                    
                    td { font-size: 14px; border-bottom: 1px solid #eee; }
                    
                    .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">Seu App de Vendas</div>
                    <div class="subtitle">Comprovante de Venda</div>
                </div>
                
                <div class="divider"></div>
                
                <p><strong>Cliente:</strong> ${venda.clienteNome}</p>
                <p><strong>Data da Venda:</strong> ${new Date(venda.data).toLocaleString('pt-BR')}</p>
                <p><strong>Forma de Pagamento:</strong> ${venda.pagamento}</p>

                <div class="divider"></div>

                <table>
                    <tr>
                        <th style="width: 15%;">Qtd</th>
                        <th style="width: 60%;">Produto</th>
                        <th style="text-align: right; width: 25%;">Valor</th>
                    </tr>
                    
                    ${itensHtml}
                </table>

                <div class="divider"></div>

                <div class="total">
                    Total: R$ ${venda.total.toFixed(2)}
                </div>

                <div class="footer">
                    Obrigado pela preferência!
                </div>
            </body>
            </html>
        `;
    };

export const gerarPDF = async (venda) => {
    try {
        const html = gerarHtmlRecibo(venda);
        const { uri } = await Print.printToFileAsync({ html: html, base64: false });
        await Sharing.shareAsync(uri);
        return true;
    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível gerar o PDF.");
        return false;
    }
}
// Configuração do Supabase
const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';

// Variável global para o cliente Supabase
let supabase = null;

// Função para inicializar o Supabase (chamada após o script carregar)
function initSupabase() {
    try {
        // O Supabase via CDN expõe o objeto 'supabase' globalmente
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado! URL:', SUPABASE_URL);
            return true;
        } else if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado via window.supabase!');
            return true;
        } else {
            console.warn('⚠️ Supabase ainda não carregou, tentando novamente...');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return false;
    }
}

// Tentar inicializar imediatamente (se o script já carregou)
if (typeof supabase !== 'undefined') {
    initSupabase();
} else {
    // Aguardar o script do Supabase carregar
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos
    
    const checkSupabase = setInterval(() => {
        attempts++;
        if (initSupabase() || attempts >= maxAttempts) {
            clearInterval(checkSupabase);
            if (!supabase && attempts >= maxAttempts) {
                console.error('❌ Não foi possível conectar ao Supabase após várias tentativas');
            }
        }
    }, 100);
}


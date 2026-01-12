// Configuração do Supabase
const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';

// Variável global para o cliente Supabase
let supabase = null;

// Função para inicializar o Supabase
function initSupabase() {
    try {
        // O Supabase via CDN expõe o objeto 'supabase' globalmente
        // Verificar diferentes formas de acesso
        if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
            supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado! URL:', SUPABASE_URL);
            return true;
        } else if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado via window.supabase!');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return false;
    }
}

// Aguardar o script do Supabase carregar e inicializar
(function() {
    let attempts = 0;
    const maxAttempts = 100; // 10 segundos
    
    const checkSupabase = setInterval(() => {
        attempts++;
        if (initSupabase()) {
            clearInterval(checkSupabase);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkSupabase);
            console.error('❌ Não foi possível conectar ao Supabase. Verifique se o script foi carregado.');
        }
    }, 100);
})();



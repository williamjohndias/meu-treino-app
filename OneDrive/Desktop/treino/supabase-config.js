// Configuração do Supabase
const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';

// Inicializar cliente Supabase
// O Supabase é carregado via CDN e fica disponível globalmente
let supabase = null;

// Função para inicializar o Supabase
function initSupabase() {
    try {
        // Verificar se o Supabase está disponível
        if (typeof supabaseLib !== 'undefined') {
            supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado via supabaseLib');
        } else if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase conectado via window.supabase');
        } else {
            // Tentar acessar diretamente do objeto global
            const SupabaseClient = window.supabase || (window.Supabase && window.Supabase.createClient);
            if (SupabaseClient && typeof SupabaseClient.createClient === 'function') {
                supabase = SupabaseClient.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase conectado via Supabase.createClient');
            } else {
                console.error('❌ Supabase não está disponível! Verifique se o script foi carregado.');
            }
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
    }
}

// Aguardar o DOM e o Supabase carregarem
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initSupabase, 200);
    });
} else {
    setTimeout(initSupabase, 200);
}


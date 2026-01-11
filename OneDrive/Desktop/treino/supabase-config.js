// Configuração do Supabase
const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Verificar conexão
console.log('✅ Supabase conectado:', SUPABASE_URL);


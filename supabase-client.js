// supabase-client.js
// 1. Importando o Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Substitua com os dados do seu projeto (Project Settings -> API)
const supabaseUrl = 'SUA_URL_DO_SUPABASE_AQUI';
const supabaseKey = 'SUA_CHAVE_ANON_PUBLICA_AQUI';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- FUNÇÕES DE AUTENTICAÇÃO ---

export async function cadastrarUsuario(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: { full_name: nome } // Salva o nome para o Trigger usar
        }
    });
    return { data, error };
}

export async function fazerLogin(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });
    return { data, error };
}

export async function fazerLogout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// --- FUNÇÕES DE BANCO DE DADOS ---

export async function obterPerfil(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    return { data, error };
}
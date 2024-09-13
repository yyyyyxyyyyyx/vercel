const SUPABASE_URL = 'https://mnizjqlixppxsrvixdyg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaXpqcWxpeHBweHNydml4ZHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MzcxMzgsImV4cCI6MjA0MDUxMzEzOH0.33xWWPYoRD0_nqxpdGFz3lK5hkcnOBcDQ06UfxVJXzw';

let supabaseClient;

async function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return false;
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
}

async function loadShowContent() {
    if (!await initSupabase()) {
        document.getElementById('show-title').textContent = 'Error: Unable to initialize database connection';
        return;
    }

    const showId = new URLSearchParams(window.location.search).get('id');
    try {
        const { data, error } = await supabaseClient
            .from('show_details')
            .select('*')
            .eq('id', showId)
            .single();

        if (error) throw error;

        if (!data) {
            throw new Error('No data found for this show');
        }

        document.title = data.title;
        document.getElementById('banner').innerHTML = `<img src="${data.banner_image}" alt="Banner Image">`;
        document.getElementById('show-title').textContent = data.title;
        
        let linksHtml = '';
        data.links.forEach(link => {
            linksHtml += `<a href="${link.url}" target="_blank">${link.name}</a> `;
        });
        document.getElementById('download-links').innerHTML = linksHtml;
    } catch (error) {
        console.error('Error loading show data:', error);
        document.getElementById('show-title').textContent = 'Error loading show data: ' + error.message;
    }
}

// 在页面加载完成后执行 loadShowContent
document.addEventListener('DOMContentLoaded', loadShowContent);
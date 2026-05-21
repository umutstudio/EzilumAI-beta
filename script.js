/* --- KAPSAMLI JAVASCRIPT DOKÜMANTASYONU --- */

// HTML elementlerine erişim sağlıyoruz
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Mesajı işleyen ve ekrana gönderen ana fonksiyon
function sendMessage() {
    const messageText = userInput.value.trim(); // Başındaki ve sonundaki boşlukları temizler
    
    // Güvenlik Kontrolü: Mesaj kutusu boşsa hiçbir şey yapma
    if (messageText === '') return;

    // 1. Kullanıcı mesajını ekrana ekle
    appendMessage(messageText, 'user-message');
    
    // Mesaj kutusunu bir sonraki yazım için sıfırla
    userInput.value = '';

    // Görünümü otomatik olarak en yeni mesaja kaydır
    scrollToBottom();

    // 2. Yapay zekanın yanıtını simüle et (Yapay zeka düşünüyormuş gibi 0.6 saniye gecikme ekledik)
    setTimeout(() => {
        const aiResponse = generateSimulatedResponse(messageText);
        appendMessage(aiResponse, 'ai-message');
        scrollToBottom();
    }, 600);
}

// HTML üzerinde dinamik olarak yeni bir mesaj div'i oluşturan yardımcı fonksiyon
function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    chatMessages.appendChild(messageDiv);
}

// Kaydırma çubuğunu daima en aşağıda tutan fonksiyon
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gelen metne göre temel mantıksal cevaplar üreten test motoru
function generateSimulatedResponse(userText) {
    const text = userText.toLowerCase();
    
    if (text.includes('merhaba') || text.includes('selam')) {
        return "Sana da merhaba! Dosya yapımız artık tamamen profesyonel standartlarda.";
    } else if (text.includes('css') || text.includes('javascript')) {
        return "CSS tasarımı canlandırır, JavaScript ise sayfaya hayat verir! Harika bir ikili.";
    } else {
        return `"${userText}" sorunu aldım. Bir sonraki aşamada bana gerçek bir akıllı veri tabanı veya API bağlayabilirsin!`;
    }
}

/* --- EVENT LISTENERS (OLAY DİNLEYİCİLERİ) --- */

// Gönder butonuna tıklandığında çalışır
sendBtn.addEventListener('click', sendMessage);

// Giriş kutusundayken klavyeden Enter tuşuna basıldığında çalışır
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
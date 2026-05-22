/* --- KAPSAMLI JAVASCRIPT BEYİN DOKÜMANTASYONU --- */

// HTML elementlerine erişim sağlıyoruz (Arayüz bağlantıları)
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

/* 
  1. HAFIZA SİSTEMİ (LOCAL STORAGE)
  Yapay zekanın kullanıcı verilerini tarayıcı hafızasında saklamasını sağlar.
  Sayfa yenilense bile kullanıcıyı unutmaz.
*/
let aiMemory = {
    userName: localStorage.getItem('ai_user_name') || '',
    customFacts: JSON.parse(localStorage.getItem('ai_custom_facts')) || {}
};

// Ana mesaj gönderme fonksiyonu
function sendMessage() {
    const messageText = userInput.value.trim();
    
    // Boş mesaj kontrolü
    if (messageText === '') return;

    // Kullanıcı mesajını ekrana bas ve girdiyi temizle
    appendMessage(messageText, 'user-message');
    userInput.value = '';
    scrollToBottom();

    // Yapay zekanın işlem yapma süresini simüle eden gecikme (0.5 saniye)
    setTimeout(() => {
        const aiResponse = processAIIntelligence(messageText);
        appendMessage(aiResponse, 'ai-message');
        scrollToBottom();
    }, 500);
}

/*
  2. GELİŞMİŞ ALGORİTMA VE KOMUT AYRIŞTIRICI
  Bu fonksiyon gelen metni analiz eder ve hangi görevi çalıştıracağına karar verir.
*/
function processAIIntelligence(userText) {
    const text = userText.toLowerCase().trim();

    // --- A. İSİM ÖĞRENME VE HAFIZA GÖREVLERİ ---
    if (text.startsWith('benim adım ') || text.startsWith('benim ismim ')) {
        // Cümlenin sonundaki ismi ayıklar
        const words = userText.split(' ');
        const name = words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        
        aiMemory.userName = name;
        localStorage.setItem('ai_user_name', name); // Tarayıcıya kaydet
        return `Tanıştığımıza memnun oldum ${name}! Artık seni bu isimle hatırlayacağım.`;
    }

    if (text.includes('benim adım ne') || text.includes('benim ismim ne')) {
        if (aiMemory.userName) {
            return `Senin adın ${aiMemory.userName}. Bunu asla unutmam!`;
        } else {
            return "Henüz bana adını söylemedin. 'Benim adım Ahmet' diyerek bana adını öğretebilirsin.";
        }
    }

    // --- B. MATEMATİKSEL İŞLEM MOTORU ---
    // Kullanıcı metninde matematiksel bir işlem olup olmadığını kontrol eder
    const mathRegex = /(\d+)\s*([\+\-\*\/]|artı|eksi|çarpı|bölü)\s*(\d+)/i;
    const match = text.match(mathRegex);

    if (match) {
        let num1 = parseInt(match[1]);
        let operator = match[2];
        let num2 = parseInt(match[3]);
        let result = 0;

        // Türkçe kelime komutlarını matematiksel sembollere dönüştürüyoruz
        if (operator === 'artı' || operator === '+') result = num1 + num2;
        else if (operator === 'eksi' || operator === '-') result = num1 - num2;
        else if (operator === 'çarpı' || operator === '*') result = num1 * num2;
        else if (operator === 'bölü' || operator === '/') {
            if (num2 === 0) return "Bir sayıyı sıfıra bölemem, bu matematiksel olarak belirsizdir!";
            result = num1 / num2;
        }

        return `Matematiksel analizi tamamladım: ${num1} ve ${num2} sayılarının işlem sonucu = **${result}**`;
    }

    // --- C. ÖZEL BİLGİ ÖĞRETME HAFIZASI ---
    // Örnek: "bunu unutma en sevdiğim renk mavi" -> Hafızaya kaydeder
    if (text.includes('bunu unutma')) {
        const factContent = userText.replace(/bunu unutma/i, '').trim();
        const factId = Date.now(); // Benzersiz bir kimlik oluşturur
        
        aiMemory.customFacts[factId] = factContent;
        localStorage.setItem('ai_custom_facts', JSON.stringify(aiMemory.customFacts));
        
        return `Mesajını veri tabanıma kaydettim: "${factContent}". İstediğin zaman bana kayıtlı bilgilerimi sorabilirsin!`;
    }

    if (text.includes('hafızanda ne var') || text.includes('ne hatırlıyorsun')) {
        const factsArray = Object.values(aiMemory.customFacts);
        if (factsArray.length === 0) {
            return "Şu an hafızamda ekstra bir bilgi yok. Bana 'Bunu unutma en sevdiğim yemek mantı' gibi şeyler söyleyebilirsin.";
        }
        return `Senin hakkında şunları hatırlıyorum:\n` + factsArray.map(f => `- ${f}`).join('\n');
    }

    // --- D. TEMEL SOHBET VE GERİ BİLDİRİM ---
    if (text.includes('merhaba') || text.includes('selam')) {
        return aiMemory.userName ? `Tekrar merhaba ${aiMemory.userName}! Sana nasıl yardımcı olabilirim?` : "Merhaba! Ben akıllı modülümle hazırım. Bana bir matematik işlemi sorabilir veya adını öğretebilirsin.";
    }

    return "Söylediğini tam olarak analiz edemedim. Şunları yapabilirim:\n1. '50 artı 25' gibi matematik işlemleri.\n2. 'Benim adım Can' diyerek isim kaydı.\n3. 'Bunu unutma [bilgi]' diyerek hafıza kaydı.";
}

// Yardımcı Fonksiyonlar (Ekrana ekleme ve kaydırma)
function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    chatMessages.appendChild(messageDiv);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* --- EVENT LISTENERS --- */
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

/* --- GÜNCELLENMİŞ YAPAY ZEKA BEYİN ALGORİTMASI --- */

function processAIIntelligence(userText) {
    // Gelen metni küçük harfe çevirip, sonundaki ve başındaki boşlukları ve soru işaretini temizliyoruz
    const text = userText.toLowerCase().trim().replace('?', '');

    // --- 1. ÖNCELİKLİ ADIM: İSİM SORGULAMA (SORU KONTROLÜ) ---
    // Hatayı çözmek için sorgulama filtresini, isim öğretme filtresinin ÜSTÜNE aldık.
    if (text.includes('benim adım ne') || text.includes('benim ismim ne')) {
        if (aiMemory.userName) {
            return `Senin adın ${aiMemory.userName}. Bunu asla unutmam!`;
        } else {
            return "Henüz bana adını söylemedin. 'Benim adım Can' diyerek bana adını öğretebilirsin.";
        }
    }

    // --- 2. ADIM: YENİ İSİM ÖĞRENME VE HAFIZAYA ALMA ---
    // Kullanıcı soru sormuyorsa ve "benim adım ..." diye başlıyorsa burası çalışır.
    if (text.startsWith('benim adım ') || text.startsWith('benim ismim ')) {
        // Cümleyi boşluklardan bölerek kelime dizisi yapıyoruz
        const words = userText.split(' ');
        // Dizideki son kelimeyi (yani ismi) alıyoruz ve üzerindeki noktayı/soru işaretini temizliyoruz
        const name = words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
        
        // İsmi belleğe ve LocalStorage'a kaydediyoruz
        aiMemory.userName = name;
        localStorage.setItem('ai_user_name', name); 
        
        return `Tanıştığımıza memnun oldum ${name}! Artık seni bu isimle hatırlayacağım.`;
    }

    // --- 3. ADIM: MATEMATİKSEL İŞLEM MOTORU (Değişmedi) ---
    const mathRegex = /(\d+)\s*([\+\-\*\/]|artı|eksi|çarpı|bölü)\s*(\d+)/i;
    const match = text.match(mathRegex);

    if (match) {
        let num1 = parseInt(match[1]);
        let operator = match[2];
        let num2 = parseInt(match[3]);
        let result = 0;

        if (operator === 'artı' || operator === '+') result = num1 + num2;
        else if (operator === 'eksi' || operator === '-') result = num1 - num2;
        else if (operator === 'çarpı' || operator === '*') result = num1 * num2;
        else if (operator === 'bölü' || operator === '/') {
            if (num2 === 0) return "Bir sayıyı sıfıra bölemem, bu matematiksel olarak belirsizdir!";
            result = num1 / num2;
        }
        return `Matematiksel analizi tamamladım: ${num1} ve ${num2} sayılarının işlem sonucu = **${result}**`;
    }

    // --- 4. ADIM: ÖZEL BİLGİ ÖĞRETME HAFIZASI (Değişmedi) ---
    if (text.includes('bunu unutma')) {
        const factContent = userText.replace(/bunu unutma/i, '').trim();
        const factId = Date.now();
        
        aiMemory.customFacts[factId] = factContent;
        localStorage.setItem('ai_custom_facts', JSON.stringify(aiMemory.customFacts));
        
        return `Mesajını veri tabanıma kaydettim: "${factContent}". İstediğin zaman bana kayıtlı bilgilerimi sorabilirsin!`;
    }

    if (text.includes('hafızanda ne var') || text.includes('ne hatırlıyorsun')) {
        const factsArray = Object.values(aiMemory.customFacts);
        if (factsArray.length === 0) {
            return "Şu an hafızamda ekstra bir bilgi yok. Bana 'Bunu unutma en sevdiğim oyun Minecraft' gibi şeyler söyleyebilirsin.";
        }
        return `Senin hakkında şunları hatırlıyorum:\n` + factsArray.map(f => `- ${f}`).join('\n');
    }

    // --- 5. ADIM: TEMEL SOHBET VE GERİ BİLDİRİM ---
    if (text.includes('merhaba') || text.includes('selam')) {
        return aiMemory.userName ? `Tekrar merhaba ${aiMemory.userName}! Sana nasıl yardımcı olabilirim?` : "Merhaba! Ben akıllı modülümle hazırım. Bana bir matematik işlemi sorabilir veya adını öğretebilirsin.";
    }

    return "Söylediğini tam olarak analiz edemedim. Şunları yapabilirim:\n1. '50 artı 25' gibi matematik işlemleri.\n2. 'Benim adım Can' diyerek isim kaydı.\n3. 'Bunu unutma [bilgi]' diyerek hafıza kaydı.";
}

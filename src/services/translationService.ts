export interface TranslationSuggestion {
  translation: string
  meaning: string
  context?: string
  confidence: number
}

const translationDatabase: Record<string, TranslationSuggestion[]> = {
  'hello': [
    { translation: 'salom', meaning: 'Umumiy salomlashish', context: 'Rasmiy va norasmiy', confidence: 0.95 },
    { translation: 'assalomu alaykum', meaning: 'Islomiy salomlashish', context: 'Rasmiy vaziyatlar', confidence: 0.90 },
    { translation: 'qalaysiz', meaning: 'Hal-ahvol so\'rash', context: 'Do\'stona muloqot', confidence: 0.75 }
  ],
  'goodbye': [
    { translation: 'xayr', meaning: 'Oddiy xayrlashish', context: 'Har qanday vaziyat', confidence: 0.95 },
    { translation: 'ko\'rishguncha', meaning: 'Keyingi uchrashuvgacha', context: 'Do\'stlar orasida', confidence: 0.85 },
    { translation: 'sog\' bo\'ling', meaning: 'Yaxshi tilak bilan xayrlashish', context: 'Hurmat bilan', confidence: 0.80 }
  ],
  'thank you': [
    { translation: 'rahmat', meaning: 'Oddiy minnatdorchilik', context: 'Kundalik muloqot', confidence: 0.95 },
    { translation: 'tashakkur', meaning: 'Rasmiy minnatdorchilik', context: 'Rasmiy vaziyatlar', confidence: 0.90 },
    { translation: 'katta rahmat', meaning: 'Kuchli minnatdorchilik', context: 'Juda minnatdor bo\'lganda', confidence: 0.85 }
  ],
  'water': [
    { translation: 'suv', meaning: 'Ichimlik, suyuqlik', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'daryo', meaning: 'Oqar suv', context: 'Katta suv havzasi', confidence: 0.70 },
    { translation: 'ichimlik', meaning: 'Ichish uchun suv', context: 'Maxsus holat', confidence: 0.75 }
  ],
  'book': [
    { translation: 'kitob', meaning: 'O\'qish uchun nashr', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'asar', meaning: 'Adabiy yoki ilmiy ish', context: 'Rasmiy kontekst', confidence: 0.80 },
    { translation: 'daftar', meaning: 'Yozish uchun kitob', context: 'Maktab buyumi', confidence: 0.70 }
  ],
  'friend': [
    { translation: 'do\'st', meaning: 'Yaqin inson', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'o\'rtoq', meaning: 'Hamroh, sheriq', context: 'Rasmiy yoki ish muhiti', confidence: 0.85 },
    { translation: 'yor', meaning: 'Juda yaqin do\'st', context: 'She\'riy, adabiy', confidence: 0.75 }
  ],
  'house': [
    { translation: 'uy', meaning: 'Yashash joyi', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'xonadon', meaning: 'Oila uyi', context: 'Rasmiy til', confidence: 0.85 },
    { translation: 'turar joy', meaning: 'Yashash uchun bino', context: 'Rasmiy hujjatlar', confidence: 0.80 }
  ],
  'love': [
    { translation: 'sevgi', meaning: 'Mehr-muhabbat hissi', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'muhabbat', meaning: 'Chuqur sevgi', context: 'Adabiy, she\'riy', confidence: 0.90 },
    { translation: 'ishq', meaning: 'Kuchli sevgi hissi', context: 'Romantik kontekst', confidence: 0.85 }
  ],
  'work': [
    { translation: 'ish', meaning: 'Mehnat faoliyati', context: 'Umumiy ma\'no', confidence: 0.95 },
    { translation: 'mehnat', meaning: 'Jismoniy yoki aqliy ish', context: 'Rasmiy til', confidence: 0.85 },
    { translation: 'xizmat', meaning: 'Xizmat ko\'rsatish', context: 'Professional muhit', confidence: 0.80 }
  ],
  'happy': [
    { translation: 'baxtli', meaning: 'Baxt hissi', context: 'Umumiy holat', confidence: 0.95 },
    { translation: 'xursand', meaning: 'Quvonchli kayfiyat', context: 'Vaqtinchalik holat', confidence: 0.90 },
    { translation: 'shod', meaning: 'Juda xursand', context: 'Kuchli his', confidence: 0.85 }
  ]
}

export class TranslationService {
  static async getSuggestions(word: string): Promise<TranslationSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const normalizedWord = word.toLowerCase().trim()
    
    // Check if we have predefined translations
    if (translationDatabase[normalizedWord]) {
      return translationDatabase[normalizedWord]
    }
    
    // Generate generic suggestions for unknown words
    return this.generateGenericSuggestions(normalizedWord)
  }
  
  private static generateGenericSuggestions(word: string): TranslationSuggestion[] {
    // For words not in our database, generate plausible suggestions
    const suggestions: TranslationSuggestion[] = []
    
    // Check word characteristics
    const isCapitalized = word[0] === word[0].toUpperCase()
    const hasNumbers = /\d/.test(word)
    const isShort = word.length <= 3
    
    if (isCapitalized) {
      // Likely a proper noun
      suggestions.push({
        translation: word,
        meaning: 'Maxsus ism (tarjima qilinmaydi)',
        context: 'Ism, familiya yoki joy nomi',
        confidence: 0.90
      })
    }
    
    if (hasNumbers) {
      // Contains numbers
      suggestions.push({
        translation: word,
        meaning: 'Raqam yoki kod',
        context: 'Texnik atama',
        confidence: 0.85
      })
    }
    
    // Add generic translations
    suggestions.push(
      {
        translation: word.toLowerCase(),
        meaning: 'To\'g\'ridan-to\'g\'ri tarjima',
        context: 'Xalqaro so\'z',
        confidence: 0.70
      },
      {
        translation: `${word} (inglizcha)`,
        meaning: 'Inglizcha atama',
        context: 'Tarjimasiz ishlatiladi',
        confidence: 0.65
      }
    )
    
    // Add a phonetic suggestion for longer words
    if (!isShort) {
      const phoneticized = this.createPhoneticVersion(word)
      suggestions.push({
        translation: phoneticized,
        meaning: 'Talaffuzga yaqin yozuv',
        context: 'Yangi so\'z',
        confidence: 0.60
      })
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
  }
  
  private static createPhoneticVersion(word: string): string {
    // Simple phonetic conversion for demonstration
    return word
      .toLowerCase()
      .replace(/ph/g, 'f')
      .replace(/th/g, 't')
      .replace(/ch/g, 'ch')
      .replace(/sh/g, 'sh')
      .replace(/tion/g, 'siya')
      .replace(/sion/g, 'siya')
      .replace(/ture/g, 'tur')
      .replace(/ity/g, 'lik')
  }
}
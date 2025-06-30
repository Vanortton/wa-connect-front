function formatWhatsAppText(text: string): string {
    function escapeHtml(t: string) {
        return t
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    // Bloco de código
    text = text.replace(
        /```([\s\S]*?)```/g,
        (_, p1) => `<pre><code>${escapeHtml(p1)}</code></pre>`
    )

    // Código inline
    text = text.replace(
        /`([^`\n]+?)`/g,
        (_, p1) => `<code>${escapeHtml(p1)}</code>`
    )

    // Itálico
    text = text.replace(/_(.+?)_/g, (_, p1) => `<em>${p1}</em>`)

    // Negrito
    text = text.replace(/\*(.+?)\*/g, (_, p1) => `<b>${p1}</b>`)

    // Rasurado
    text = text.replace(/~(.+?)~/g, (_, p1) => `<s>${p1}</s>`)

    // Citação
    text = text.replace(
        /^> (.+)$/gm,
        (_, p1) => `<blockquote>${p1}</blockquote>`
    )

    // Marca linhas de lista numerada com prefixo exclusivo
    text = text.replace(
        /^(\d+)\. (.+)$/gm,
        (_, num, item) => `__numlist__${num}. ${item}`
    )

    // Marca linhas de lista com marcador (* ou -)
    text = text.replace(
        /^(\*|-)\s+(.+)$/gm,
        (_, _2, item) => `__bulletlist__${item}`
    )

    // Processa blocos de lista numerada
    text = text.replace(/(?:^__numlist__.+(?:\n|$))+?/gm, (block) => {
        const items = block
            .trim()
            .split('\n')
            .map((line) => line.replace(/^__numlist__\d+\. /, ''))
        return `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`
    })

    // Processa blocos de lista com marcador
    text = text.replace(/(?:^__bulletlist__.+(?:\n|$))+?/gm, (block) => {
        const items = block
            .trim()
            .split('\n')
            .map((line) => line.replace(/^__bulletlist__/, ''))
        return `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
    })

    // Detecta e transforma URLs em links
    // regex simples para URL http(s):// ou www.
    const urlRegex = /(\bhttps?:\/\/[^\s<]+|\bwww\.[^\s<]+)/g
    text = text.replace(urlRegex, (url) => {
        let href = url
        if (!href.startsWith('http')) href = 'http://' + href
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-500">${url}</a>`
    })

    return text
}

function removeWhatsAppFormatting(text: string): string {
    // Remove blocos de código ```texto```
    text = text.replace(/```([\s\S]*?)```/g, (_, p1) => p1.trim())

    // Remove código inline `texto`
    text = text.replace(/`([^`\n]+?)`/g, (_, p1) => p1)

    // Remove itálico _texto_
    text = text.replace(/_(.+?)_/g, (_, p1) => p1)

    // Remove negrito *texto*
    text = text.replace(/\*(.+?)\*/g, (_, p1) => p1)

    // Remove rasurado ~texto~
    text = text.replace(/~(.+?)~/g, (_, p1) => p1)

    // Remove citação > texto (mas mantém o texto)
    text = text.replace(/^> (.+)$/gm, (_, p1) => p1)

    // Remove prefixos de lista numerada (1. texto)
    text = text.replace(/^\d+\.\s+/gm, '')

    // Remove prefixos de lista com marcador (* texto ou - texto)
    text = text.replace(/^(\*|-)\s+/gm, '')

    return text
}

export { formatWhatsAppText, removeWhatsAppFormatting }

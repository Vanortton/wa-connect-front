function getFileName(url: string) {
    const path = url.split('?')[0]
    const fileNameEncoded = path.substring(path.lastIndexOf('/') + 1)
    const fileName = decodeURIComponent(fileNameEncoded)

    const nameWithoutPrefix = fileName.includes('_')
        ? fileName.substring(fileName.indexOf('_') + 1)
        : fileName

    return nameWithoutPrefix
}

const downloadFile = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = getFileName(url)
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export { downloadFile, getFileName }

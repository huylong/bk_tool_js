console.log("Use this address in your browser:",
document.getElementsByTagName('iframe')[0].src = document.getElementsByTagName('iframe')[0].src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android"));
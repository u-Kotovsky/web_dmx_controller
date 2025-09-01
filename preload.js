window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      	const element = document.getElementById(selector)
    	if (element) element.innerText = text
	}

  	for (const type of ['chrome', 'node', 'electron']) {
    	replaceText(`${type}-version`, process.versions[type])
  	}
})
/*
var windowTopBar = document.body
windowTopBar.style.width = "100%"
windowTopBar.style.height = "32px"
windowTopBar.style.backgroundColor = "#ffffffff"
windowTopBar.style.position = "absolute"
windowTopBar.style.top = windowTopBar.style.left = 0
windowTopBar.style.webkitAppRegion = "drag"
document.body.appendChild(windowTopBar)*/
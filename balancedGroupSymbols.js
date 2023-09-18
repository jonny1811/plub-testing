function isBalanced(word) {
	let accum = []

	for(let i = 0; i < word.length; i++) {
		let expr = word[i]
		
		if (expr === '(' || expr === '[' || expr === '{') {
			accum.push(expr)
			continue
		}

		if (accum.length === 0) {
			return false
		}

		let verf
		switch (expr) {
			case ')':
				verf = accum.pop()
				if (verf === '{' || verf === '[') {
					return false
				}
				break
			case '}':
				verf = accum.pop()
				if (verf === '(' || verf === '[') {
					return false
				}
				break
			case ']':
				verf = accum.pop()
				if (verf === '(' || verf === '{') {
					return false
				}
				break
		}
	}
	return (accum.length === 0)
}

(() => {
	let expresion = '[([)]})]{}{()()}'
	if (isBalanced(expresion)) {
		console.log("Balanced")
	} else {
		console.log("Not Balanced")
	}
})()
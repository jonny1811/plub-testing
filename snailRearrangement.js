function snail(array) {
	let finalArray = []
	while(array.length) {
		finalArray.push(...array.shift())
		for (let i = 0; i < array.length; i++) {
			finalArray.push(array[i].pop())
		}
		finalArray.push(...(array.pop() || []).reverse())
		for (let i = array.length - 1; i >= 0; i--) {
			finalArray.push(array[i].shift())
		}
	}
	return finalArray
}

(() => {
	// arrayRearranged = snail([[1,2,3],[4,5,6],[7,8,9]])
	// console.log(arrayRearranged)
	arrayRearranged1 = snail([[1,2,3],[8,9,4],[7,6,5]])
	console.log(arrayRearranged1)
})()
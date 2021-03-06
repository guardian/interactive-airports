const $ = selector => document.querySelector(selector)
const $$ = selector => [].slice.apply(document.querySelectorAll(selector))

const round = (value, exp) => {
	if (typeof exp === 'undefined' || +exp === 0)
		return Math.round(value);

	value = +value;
	exp = +exp;

	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
		return NaN;

	value = value.toString().split('e');
	value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

const numberWithCommas = x => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const wait = ms => new Promise((resolve, reject) => setTimeout(() => resolve(), ms ))

const getDimensions = el => {
	const width = el.clientWidth || el.getBoundingClientRect().width
	const height = el.clientHeight || el.getBoundingClientRect().height
	return [ width, height ]
}

const hashPattern = (patternId, pathClass, rectClass, a = 4) => {

	return `
		<pattern id='${patternId}' patternUnits='userSpaceOnUse' width='${a}' height='${a}'>
			<rect width='${a}' height='${a}' class='${rectClass}'></rect>
			<path d='M-1,1 l2,-2 M0,${a} l${a},-${a} M${a-1},${a+1} l2,-2' class='${pathClass}'></path>
		</pattern>
	`

}

const duplicate = ( el, className ) => {

	const clone = el.cloneNode(true)
	clone.classList.add(className)
	el.parentNode.insertBefore(clone, el)

}

const pseq = (arr, lambda) => {

	return arr.reduce( (agg, cur, i, arr) => {

		return agg.then(res => lambda(cur, i, arr).then( res2 => res.concat(res2)))

	}, Promise.resolve([]) )

}

export { $, $$, round, numberWithCommas, wait, getDimensions, hashPattern, duplicate, pseq }
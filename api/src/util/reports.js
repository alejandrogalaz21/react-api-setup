import { isEmpty, getSafe, generateMatrix } from './index'

// Conditionally add properties to a query object
export function addFilters(filters, ...props) {
	let query = {}
	props.forEach((prop) => {
		if (!isEmpty(filters[prop])) {
			query[prop] = filters[prop]
		}
	})
	return query
}

// Format the array into a bidimensional matrix (rows x columns)
export const createMatrix = (data, columns) => {
	// Intialize headers and content arrays
	const headers = columns.map((column) => column.title)
	const content = generateMatrix(data.length, columns.length)

	// Iteratively fill the workbook, column by column
	data.forEach((row, indexRow) => {
		columns.forEach((column, indexCol) => {
			const { value } = column
			// Apply the formatter function or acces the plain property
			const cell = typeof value === 'function' ? getSafe(() => value(row)) : row[value]
			//? Insert the value of the cell in the current position of the matrix
			content[indexRow][indexCol] = cell
		})
	})

	return { headers, content }
}

// Format object into a matrix of keys and values
export function getDetail(data, columns) {
	let result = []
	for (let row of columns) {
		const isHidden = typeof row.hidden === 'function' ? getSafe(() => row.hidden(data), false) : false
		if (!isHidden) {
			const { title, value } = row
			const cell = typeof value === 'function' ? getSafe(() => value(data), 'N/A') : data[value]
			result.push([ title, cell ])
		}
	}
	return result
}

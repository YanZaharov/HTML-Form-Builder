import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import './FormPreview.css'

function FormPreview({ formElements }) {
	// Создаем JSON Schema на основе элементов формы
	const schema = {
		type: 'object',
		properties: formElements.reduce((acc, elem) => {
			let type
			let enumValues
			switch (elem.type) {
				case 'number':
					type = 'number'
					break
				case 'checkbox':
					type = 'boolean'
					break
				case 'listbox':
				case 'combobox':
					type = 'string'
					enumValues = ['Option 1', 'Option 2'] // Значения для listbox и combobox
					break
				case 'radiobuttons':
					type = 'string'
					enumValues = ['Option 1', 'Option 2'] // Значения для радио-кнопок
					break
				default:
					type = 'string'
					break
			}

			acc[elem.id] = {
				type,
				title: elem.label,
				...(enumValues ? { enum: enumValues } : {}),
			}
			return acc
		}, {}),
	}

	// Создаем UI Schema с указанием нужных виджетов
	const uischema = {
		type: 'VerticalLayout',
		elements: formElements.map(elem => {
			let control = {
				type: 'Control',
				scope: `#/properties/${elem.id}`,
			}

			// Настройка виджетов в зависимости от типа элемента
			switch (elem.type) {
				case 'number':
					control = {
						...control,
						options: { inputType: 'number', placeholder: 'Enter a number' },
					}
					break
				case 'checkbox':
					control = { ...control, options: { format: 'checkbox' } }
					break
				case 'listbox':
				case 'combobox':
					control = { ...control, options: { format: 'select' } }
					break
				case 'radiobuttons':
					control = { ...control, options: { format: 'radio' } }
					break
				default:
					control = { ...control, options: { format: 'text' } }
					break
			}

			return control
		}),
	}

	// Преобразуем значения из formElements для передачи в JSON Forms
	const data = formElements.reduce((acc, elem) => {
		let value
		if (elem.type === 'number') {
			value = elem.value !== undefined ? Number(elem.value) : undefined
		} else if (elem.type === 'checkbox') {
			value = elem.value || false
		} else if (['listbox', 'combobox', 'radiobuttons'].includes(elem.type)) {
			value = ['Option 1', 'Option 2'].includes(elem.value)
				? elem.value
				: 'Option 1' // Значение по умолчанию, если не совпадает с enum
		} else {
			value = elem.value || '' // Для остальных типов значения по умолчанию пустое
		}
		acc[elem.id] = value
		return acc
	}, {})

	return (
		<div className='form-preview'>
			<JsonForms
				schema={schema}
				uischema={uischema}
				data={data}
				renderers={materialRenderers}
			/>
		</div>
	)
}

export default FormPreview

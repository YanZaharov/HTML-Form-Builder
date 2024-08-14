import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import './FormPreview.css'

function FormPreview({ formElements }) {
	// Создаем JSON Schema на основе элементов формы
	const schema = {
		type: 'object',
		properties: formElements.reduce((acc, elem) => {
			let type
			switch (elem.type) {
				case 'number':
					type = 'number'
					break
				case 'checkbox':
					type = 'boolean'
					break
				case 'listbox':
				case 'combobox':
				case 'radiobuttons':
					type = 'string'
					break
				default:
					type = 'string'
					break
			}

			acc[elem.id] = {
				type,
				title: elem.label,
				...(elem.type === 'listbox' ||
				elem.type === 'combobox' ||
				elem.type === 'radiobuttons'
					? { enum: ['Option 1', 'Option 2'] } // Добавляем enum для списка и радио-кнопок
					: {}),
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
					control = { ...control, options: { inputType: 'number' } }
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

	return (
		<div className='form-preview'>
			<JsonForms
				schema={schema}
				uischema={uischema}
				data={formElements.reduce((acc, elem) => {
					acc[elem.id] = elem.value || (elem.type === 'checkbox' ? false : '')
					return acc
				}, {})}
				renderers={materialRenderers}
			/>
		</div>
	)
}

export default FormPreview

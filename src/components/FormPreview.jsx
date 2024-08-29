import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Box } from '@mui/material'

// Функция для построения схемы
const buildSchema = elements => {
	const properties = {}

	elements.forEach(elem => {
		if (!elem || !elem.id) {
			console.error('Invalid element or missing id:', elem)
			return
		}

		if (elem.type === 'group' || elem.type === 'layout') {
			properties[elem.id] = {
				type: 'object',
				properties: buildSchema(elem.children).properties,
			}
		} else {
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
					enumValues = elem.enum || ['Option 1', 'Option 2']
					break
				case 'radiobuttons':
					type = 'string'
					enumValues = elem.enum || ['Option 1', 'Option 2']
					break
				default:
					type = 'string'
					break
			}

			properties[elem.id] = {
				type,
				title: elem.label,
				...(enumValues ? { enum: enumValues } : {}),
			}
		}
	})

	return { type: 'object', properties }
}

// Функция для построения UI-схемы
const buildUiSchema = elements => {
	const uischema = { type: 'VerticalLayout', elements: [] }

	elements.forEach(elem => {
		if (!elem || !elem.id) {
			console.error('Invalid UI schema element or missing id:', elem)
			return
		}

		if (elem.type === 'group' || elem.type === 'layout') {
			uischema.elements.push({
				type:
					elem.type === 'group' ? 'Group' : elem.layoutType || 'VerticalLayout',
				label: elem.label,
				elements: buildUiSchema(elem.children).elements,
			})
		} else {
			const control = {
				type: 'Control',
				scope: `#/properties/${elem.id}`,
				options: { readOnly: true }, // Рид-онли для превью
			}

			switch (elem.type) {
				case 'number':
					control.options = {
						...control.options,
						inputType: 'number',
						placeholder: elem.placeholder || 'Enter a number',
					}
					break
				case 'checkbox':
					control.options = {
						...control.options,
						format: 'checkbox',
					}
					break
				case 'listbox':
				case 'combobox':
					control.options = {
						...control.options,
						format: 'select',
					}
					break
				case 'radiobuttons':
					control.options = {
						...control.options,
						format: 'radio',
					}
					break
				default:
					control.options = {
						...control.options,
						format: 'text',
					}
					break
			}

			uischema.elements.push(control)
		}
	})

	return uischema
}

// Функция для построения данных
const buildData = elements => {
	const data = {}

	elements.forEach(elem => {
		if (!elem || !elem.id) {
			console.error('Invalid data element or missing id:', elem)
			return
		}

		if (elem.type === 'group' || elem.type === 'layout') {
			data[elem.id] = buildData(elem.children)
		} else {
			let value
			if (elem.type === 'number') {
				value = elem.value !== undefined ? Number(elem.value) : undefined
			} else if (elem.type === 'checkbox') {
				value = elem.value === true
			} else if (['listbox', 'combobox', 'radiobuttons'].includes(elem.type)) {
				value =
					elem.enum && elem.enum.includes(elem.value)
						? elem.value
						: (elem.enum && elem.enum[0]) || 'Option 1'
			} else {
				value = elem.value || ''
			}
			data[elem.id] = value
		}
	})

	return data
}

function FormPreview({ formElements }) {
	const schema = buildSchema(formElements)
	const uischema = buildUiSchema(formElements)
	const data = buildData(formElements)

	return (
		<Box
			sx={{
				border: '1px solid #4a4a4a',
				backgroundColor: '#1e1e1e',
				padding: 2,
				overflowY: 'auto',
				borderRadius: 1,
				height: '460px',
			}}
		>
			<JsonForms
				schema={schema}
				uischema={uischema}
				data={data}
				renderers={materialRenderers}
				readOnly
			/>
		</Box>
	)
}

export default FormPreview

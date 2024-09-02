import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Box } from '@mui/material'

function FormPreview({ formElements }) {
	// Создаем схему для JSONForms
	const schema = {
		type: 'object',
		properties: formElements.reduce((acc, elem) => {
			let type = 'string'
			let enumValues = []

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
					enumValues = elem.enum || [] // Убедитесь, что enum определен
					break
				case 'radiobuttons':
					type = 'string'
					enumValues = elem.enum || [] // Убедитесь, что enum определен
					break
				default:
					type = 'string'
					break
			}

			acc[elem.id] = {
				type,
				title: elem.label,
				...(elem.required ? { default: '' } : {}),
				...(enumValues.length ? { enum: enumValues } : {}),
				...(elem.minLength ? { minLength: elem.minLength } : {}),
				...(elem.maxLength ? { maxLength: elem.maxLength } : {}),
				...(elem.pattern ? { pattern: elem.pattern } : {}),
				...(elem.minimum ? { minimum: elem.minimum } : {}),
				...(elem.maximum ? { maximum: elem.maximum } : {}),
				...(elem.multipleOf ? { multipleOf: elem.multipleOf } : {}),
			}
			return acc
		}, {}),
		required: formElements.filter(elem => elem.required).map(elem => elem.id),
	}

	// Создаем UI схему для JSONForms
	const uischema = {
		type: 'VerticalLayout',
		elements: formElements.map(elem => {
			let control = {
				type: 'Control',
				scope: `#/properties/${elem.id}`,
				options: {
					readOnly: true,
					...(elem.required && { validation: { required: true } }),
				},
			}

			switch (elem.type) {
				case 'number':
					control = {
						...control,
						options: {
							...control.options,
							inputType: 'number',
							placeholder: 'Enter a number',
							...(elem.minimum && { minimum: elem.minimum }),
							...(elem.maximum && { maximum: elem.maximum }),
							...(elem.multipleOf && { multipleOf: elem.multipleOf }),
						},
					}
					break
				case 'checkbox':
					control = {
						...control,
						options: {
							...control.options,
							format: 'checkbox',
						},
					}
					break
				case 'listbox':
				case 'combobox':
					control = {
						...control,
						options: {
							...control.options,
							format: 'select',
							enum: elem.enum || [], // Убедитесь, что enum определен
						},
					}
					break
				case 'radiobuttons':
					control = {
						...control,
						options: {
							...control.options,
							format: 'radio',
							enum: elem.enum || [], // Убедитесь, что enum определен
						},
					}
					break
				default:
					control = {
						...control,
						options: {
							...control.options,
							format: 'text',
							...(elem.minLength && { minLength: elem.minLength }),
							...(elem.maxLength && { maxLength: elem.maxLength }),
							...(elem.pattern && { pattern: elem.pattern }),
						},
					}
					break
			}

			return control
		}),
	}

	// Создаем данные для JSONForms
	const data = formElements.reduce((acc, elem) => {
		let value
		if (elem.type === 'number') {
			value = elem.value !== undefined ? Number(elem.value) : undefined
		} else if (elem.type === 'checkbox') {
			value = elem.value === true
		} else if (['listbox', 'combobox', 'radiobuttons'].includes(elem.type)) {
			value =
				elem.value !== undefined && elem.enum && elem.enum.includes(elem.value)
					? elem.value
					: elem.enum
					? elem.enum[0] // Устанавливаем значение по умолчанию как первый элемент enum
					: ''
		} else {
			value = elem.value || ''
		}
		acc[elem.id] = value
		return acc
	}, {})

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
				validationMode='validateOnChange'
			/>
		</Box>
	)
}

export default FormPreview

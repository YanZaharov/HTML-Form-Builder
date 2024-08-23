import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Box } from '@mui/material'

function FormPreview({ formElements }) {
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
					enumValues = ['Option 1', 'Option 2']
					break
				case 'radiobuttons':
					type = 'string'
					enumValues = ['Option 1', 'Option 2']
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

	const uischema = {
		type: 'VerticalLayout',
		elements: formElements.map(elem => {
			let control = {
				type: 'Control',
				scope: `#/properties/${elem.id}`,
				options: { readOnly: true },
			}

			switch (elem.type) {
				case 'number':
					control = {
						...control,
						options: {
							...control.options,
							inputType: 'number',
							placeholder: 'Enter a number',
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
						},
					}
					break
				case 'radiobuttons':
					control = {
						...control,
						options: {
							...control.options,
							format: 'radio',
						},
					}
					break
				default:
					control = {
						...control,
						options: {
							...control.options,
							format: 'text',
						},
					}
					break
			}

			return control
		}),
	}

	const data = formElements.reduce((acc, elem) => {
		let value
		if (elem.type === 'number') {
			value = elem.value !== undefined ? Number(elem.value) : undefined
		} else if (elem.type === 'checkbox') {
			value = elem.value === true
		} else if (['listbox', 'combobox', 'radiobuttons'].includes(elem.type)) {
			value = ['Option 1', 'Option 2'].includes(elem.value)
				? elem.value
				: 'Option 1'
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
			/>
		</Box>
	)
}

export default FormPreview

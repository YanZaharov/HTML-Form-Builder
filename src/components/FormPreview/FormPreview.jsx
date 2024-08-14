import { materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import './FormPreview.css'

function FormPreview({ formElements }) {
	const schema = {
		type: 'object',
		properties: formElements.reduce((acc, elem) => {
			acc[elem.id] = {
				type: elem.type === 'number' ? 'number' : 'string',
				title: elem.label,
			}
			return acc
		}, {}),
	}

	const uischema = {
		type: 'Group',
		elements: formElements.map(elem => ({
			type: 'Control',
			scope: `#/properties/${elem.id}`,
			options: {
				label: elem.label,
				...(elem.type === 'number' && { widget: 'number' }),
			},
		})),
	}

	return (
		<div className='form-preview'>
			<JsonForms
				schema={schema}
				uischema={uischema}
				data={formElements.reduce((acc, elem) => {
					acc[elem.id] = elem.value
					return acc
				}, {})}
				renderers={materialRenderers}
			/>
		</div>
	)
}

export default FormPreview

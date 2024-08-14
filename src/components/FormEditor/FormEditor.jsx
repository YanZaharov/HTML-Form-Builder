import { useDrop } from 'react-dnd'
import FormElement from '../FormElement/FormElement'
import './FormEditor.css'

function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [, drop] = useDrop({
		accept: 'widget',
		drop: item => handleDrop(item),
	})

	const moveElement = (fromIndex, toIndex) => {
		const updatedElements = [...formElements]
		const [movedElement] = updatedElements.splice(fromIndex, 1)
		updatedElements.splice(toIndex, 0, movedElement)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const handleDrop = item => {
		const newElement = {
			id: Date.now().toString(), // Используем строку для уникального идентификатора
			type: item.type,
			label: item.label,
			value: '',
		}
		const updatedElements = [...formElements, newElement]
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const updateJsonCode = elements => {
		const schema = convertToJsonSchema(elements)
		const uiSchema = convertToUiSchema(elements)
		const json = JSON.stringify({ schema, uischema: uiSchema }, null, 2)
		setJsonCode(json)
	}

	const convertToJsonSchema = elements => {
		const properties = elements.reduce((acc, el) => {
			const type =
				el.type === 'number'
					? 'number'
					: el.type === 'checkbox'
					? 'boolean'
					: 'string'
			acc[el.id] = { type, title: el.label }
			return acc
		}, {})

		return {
			type: 'object',
			properties,
		}
	}

	const convertToUiSchema = elements => {
		return {
			type: 'VerticalLayout',
			elements: elements.map(el => ({
				type: 'Control',
				scope: `#/properties/${el.id}`,
				options: {
					format: el.type === 'checkbox' ? 'checkbox' : el.type,
				},
			})),
		}
	}

	const handleElementChange = (id, newProps) => {
		const updatedElements = formElements.map(el =>
			el.id === id ? { ...el, ...newProps } : el
		)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const handleElementDelete = id => {
		const updatedElements = formElements.filter(el => el.id !== id)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	return (
		<div className='form-editor' ref={drop}>
			{formElements.map((element, index) => (
				<FormElement
					key={element.id}
					element={element}
					index={index}
					moveElement={moveElement}
					handleElementChange={handleElementChange}
					handleElementDelete={handleElementDelete}
				/>
			))}
		</div>
	)
}

export default FormEditor

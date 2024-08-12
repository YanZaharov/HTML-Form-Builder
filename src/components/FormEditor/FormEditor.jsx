import { useDrop } from 'react-dnd'
import FormElement from '../FormElement/FormElement'
import './FormEditor.css'

// Главный компонент редактора формы
function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [, drop] = useDrop({
		accept: 'widget',
		drop: item => {
			handleDrop(item)
		},
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
			id: Date.now(),
			type: item.type,
			label: item.label,
			value: '',
		}
		const updatedElements = [...formElements, newElement]
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const updateJsonCode = elements => {
		const json = JSON.stringify(elements, null, 2)
		setJsonCode(json)
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

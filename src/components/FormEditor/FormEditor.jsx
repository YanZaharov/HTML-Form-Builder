import { Box } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import FormElement from '../FormElement/FormElement'

const ItemType = 'widget'

function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [draggingIndex, setDraggingIndex] = useState(null)
	const [highlightedIndex, setHighlightedIndex] = useState(null) // Добавляем состояние для подсветки
	const containerRef = useRef(null)

	const updateJsonCode = useCallback(
		elements => {
			const schema = convertToJsonSchema(elements)
			const uiSchema = convertToUiSchema(elements)
			const json = JSON.stringify({ schema, uischema: uiSchema }, null, 2)
			setJsonCode(json)
		},
		[setJsonCode]
	)

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

	const convertToUiSchema = elements => ({
		type: 'VerticalLayout',
		elements: elements.map(el => ({
			type: 'Control',
			scope: `#/properties/${el.id}`,
			options: {
				format: el.type === 'checkbox' ? 'checkbox' : el.type,
			},
		})),
	})

	const moveElement = useCallback(
		(fromIndex, toIndex) => {
			if (fromIndex === toIndex) return

			const updatedElements = [...formElements]
			const [movedElement] = updatedElements.splice(fromIndex, 1)
			updatedElements.splice(toIndex, 0, movedElement)
			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
		},
		[formElements, setFormElements, updateJsonCode]
	)

	const handleDrop = item => {
		const existingIndex = formElements.findIndex(el => el.id === item.id)

		if (existingIndex !== -1) {
			moveElement(existingIndex, formElements.length) // Переместите в конец
		} else {
			const newElement = {
				id: Date.now().toString(),
				type: item.type,
				label: item.label,
				value: '',
			}
			const updatedElements = [...formElements, newElement]
			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
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

	const handleDragStart = index => {
		setDraggingIndex(index)
	}

	const handleDragEnd = () => {
		setDraggingIndex(null)
		setHighlightedIndex(null) // Сброс подсветки после завершения перетаскивания
	}

	const [{ isOver }, dropRef] = useDrop({
		accept: ItemType,
		drop: (item, monitor) => {
			if (!monitor.didDrop()) {
				handleDrop(item)
			}
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	})

	return (
		<Box
			ref={node => {
				dropRef(node)
				containerRef.current = node
			}}
			sx={{
				p: 2,
				backgroundColor: 'background.paper',
				border: '2px dashed',
				borderColor: isOver ? 'primary.main' : 'divider',
				minHeight: '400px',
				borderRadius: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				overflowY: 'auto',
				paddingBottom: '100px', // Space for new elements
			}}
		>
			{formElements.map((element, index) => (
				<FormElement
					key={element.id}
					element={element}
					index={index}
					moveElement={moveElement}
					handleElementChange={handleElementChange}
					handleElementDelete={handleElementDelete}
					onDragStart={() => handleDragStart(index)}
					onDragEnd={handleDragEnd}
					draggingIndex={draggingIndex}
					highlighted={highlightedIndex === index} // Передаем состояние подсветки
					onHover={() => setHighlightedIndex(index)} // Обновляем индекс подсвеченного элемента
					onLeave={() => setHighlightedIndex(null)} // Сбрасываем индекс подсвеченного элемента
				/>
			))}
		</Box>
	)
}

export default FormEditor

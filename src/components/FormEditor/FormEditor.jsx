import { Box } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import FormElement from '../FormElement/FormElement'

const ItemType = 'widget'

function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [draggingIndex, setDraggingIndex] = useState(null)
	const [newElementPosition, setNewElementPosition] = useState(null)
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
		const dropIndex =
			newElementPosition !== null ? newElementPosition : formElements.length
		const existingIndex = formElements.findIndex(el => el.id === item.id)

		if (existingIndex !== -1) {
			moveElement(existingIndex, dropIndex)
		} else {
			const newElement = {
				id: Date.now().toString(),
				type: item.type,
				label: item.label,
				value: '',
			}
			const updatedElements = [...formElements]
			updatedElements.splice(dropIndex, 0, newElement)
			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
		}
		setNewElementPosition(null)
	}

	const handleDragStart = index => {
		setDraggingIndex(index)
	}

	const handleDragEnd = () => {
		setDraggingIndex(null)
		setNewElementPosition(null)
	}

	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: ItemType,
		drop: item => {
			handleDrop(item)
		},
		hover: (item, monitor) => {
			const containerNode = containerRef.current
			if (containerNode) {
				const { top, bottom } = containerNode.getBoundingClientRect()
				const mouseY = monitor.getClientOffset().y
				const scrollY = window.scrollY || document.documentElement.scrollTop

				const elementsHeights = formElements.map((_, index) => {
					const elementNode = containerNode.children[index]
					return elementNode ? elementNode.clientHeight : 0
				})

				let cumulativeHeight = top + scrollY
				let newIndex = formElements.length

				for (let i = 0; i < elementsHeights.length; i++) {
					cumulativeHeight += elementsHeights[i] + 10 // Учитываем margin между элементами
					if (mouseY < cumulativeHeight) {
						newIndex = i
						break
					}
				}

				if (newIndex !== newElementPosition) {
					setNewElementPosition(newIndex)
				}
			}
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
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
				position: 'relative',
				paddingBottom: '160px',
			}}
		>
			{formElements.map((element, index) => (
				<FormElement
					key={element.id}
					element={element}
					index={index}
					moveElement={moveElement}
					handleElementChange={(id, changes) =>
						setFormElements(prevElements =>
							prevElements.map(el =>
								el.id === id ? { ...el, ...changes } : el
							)
						)
					}
					handleElementDelete={id =>
						setFormElements(prevElements =>
							prevElements.filter(el => el.id !== id)
						)
					}
					onDragStart={() => handleDragStart(index)}
					onDragEnd={handleDragEnd}
					draggingIndex={draggingIndex}
					highlighted={newElementPosition === index}
				/>
			))}
		</Box>
	)
}

export default FormEditor

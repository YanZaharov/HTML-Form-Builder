import { Box } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import FormElement from './FormElement'
import LayoutElement from './LayoutElement'

const ItemType = 'widget'

const generateUniqueId = () => {
	return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

const convertToJsonSchema = elements => {
	const properties = {}

	elements.forEach(element => {
		if (
			element &&
			element.id &&
			element.type &&
			!['verticalLayout', 'horizontalLayout'].includes(element.type)
		) {
			properties[element.id] = {
				type: element.type === 'number' ? 'number' : 'string',
				title: element.label || '',
				default: element.value || '',
			}
		}

		if (element && element.children) {
			Object.assign(
				properties,
				convertToJsonSchema(element.children).properties
			)
		}
	})

	return { type: 'object', properties }
}

const convertToUiSchema = elements => {
	const processElement = element => {
		if (!element || !element.type || !element.id) {
			console.error('Invalid element or missing id/type:', element)
			return null
		}

		if (['verticalLayout', 'horizontalLayout'].includes(element.type)) {
			return {
				type:
					element.type === 'verticalLayout'
						? 'VerticalLayout'
						: 'HorizontalLayout',
				elements: element.children
					? element.children.map(processElement).filter(Boolean)
					: [],
			}
		}

		return {
			type: 'Control',
			scope: `#/properties/${element.id}`,
		}
	}

	return {
		type: 'VerticalLayout',
		elements: elements.map(processElement).filter(Boolean),
	}
}

function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [draggingIndex, setDraggingIndex] = useState(null)
	const [newElementPosition, setNewElementPosition] = useState(null)
	const [hoveredElement, setHoveredElement] = useState(null)
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

	const moveElement = useCallback(
		(fromIndexOrElement, toIndex, parentId) => {
			let movedElement

			if (typeof fromIndexOrElement === 'number') {
				if (
					fromIndexOrElement < 0 ||
					fromIndexOrElement >= formElements.length
				) {
					console.error('Invalid fromIndex:', fromIndexOrElement)
					return
				}
				movedElement = formElements[fromIndexOrElement]
				const updatedElements = [...formElements]
				updatedElements.splice(fromIndexOrElement, 1) // Remove element from old position
				setFormElements(updatedElements)
			} else {
				movedElement = fromIndexOrElement
			}

			if (!movedElement || !movedElement.type || !movedElement.id) {
				console.error('Invalid moved element:', movedElement)
				return
			}

			const insertIntoParent = (elements, id, element) => {
				if (!id) {
					console.error('Parent ID is undefined')
					return false
				}

				for (let el of elements) {
					if (el.id === id) {
						el.children = el.children || []
						el.children.splice(toIndex, 0, element)
						return true
					}
					if (el.children && insertIntoParent(el.children, id, element)) {
						return true
					}
				}
				return false
			}

			const updatedElements = [...formElements]
			if (parentId === null) {
				updatedElements.splice(toIndex, 0, movedElement)
			} else if (!insertIntoParent(updatedElements, parentId, movedElement)) {
				console.error('Failed to insert element into parent:', parentId)
				return
			}

			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
		},
		[formElements, setFormElements, updateJsonCode]
	)

	const handleDrop = useCallback(
		item => {
			if (!item || !item.type) {
				console.error('Invalid item dropped:', item)
				return
			}

			console.log('Dropped item:', item)

			const dropIndex =
				newElementPosition !== null ? newElementPosition : formElements.length

			const createNewElement = () => ({
				id: generateUniqueId(),
				type: item.type,
				label: item.label,
				value: item.type === 'listBox' ? 'default' : '',
				children: item.type.includes('Layout') ? [] : undefined,
			})

			if (hoveredElement) {
				if (
					['verticalLayout', 'horizontalLayout'].includes(hoveredElement.type)
				) {
					if (item.index !== undefined) {
						moveElement(item.index, dropIndex, hoveredElement.id)
					} else {
						const newElement = createNewElement()
						moveElement(newElement, dropIndex, hoveredElement.id)
					}
				}
			} else {
				if (item.index !== undefined) {
					moveElement(item.index, dropIndex, null)
				} else {
					const newElement = createNewElement()
					const updatedElements = [...formElements]
					updatedElements.splice(dropIndex, 0, newElement)
					setFormElements(updatedElements)
					updateJsonCode(updatedElements)
				}
			}

			setNewElementPosition(null)
			setHoveredElement(null)
		},
		[
			formElements,
			newElementPosition,
			hoveredElement,
			moveElement,
			setFormElements,
			updateJsonCode,
		]
	)

	const handleDragStart = useCallback(index => {
		setDraggingIndex(index.toString()) // Convert to string if needed
	}, [])

	const handleDragEnd = useCallback(() => {
		setDraggingIndex(null)
		setNewElementPosition(null)
		setHoveredElement(null)
	}, [])

	const handleElementDelete = useCallback(
		id => {
			const deleteElement = (elements, idToDelete) => {
				return elements.reduce((acc, el) => {
					if (el.id === idToDelete) return acc
					if (el.children) el.children = deleteElement(el.children, idToDelete)
					acc.push(el)
					return acc
				}, [])
			}

			const updatedElements = deleteElement(formElements, id)
			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
		},
		[formElements, setFormElements, updateJsonCode]
	)

	const handleElementChange = useCallback(
		(id, newProperties) => {
			const updateElement = (elements, idToUpdate, newProps) => {
				return elements.map(el => {
					if (el.id === idToUpdate) {
						return { ...el, ...newProps }
					}
					if (el.children) {
						return {
							...el,
							children: updateElement(el.children, idToUpdate, newProps),
						}
					}
					return el
				})
			}

			const updatedElements = updateElement(formElements, id, newProperties)
			setFormElements(updatedElements)
			updateJsonCode(updatedElements)
		},
		[formElements, setFormElements, updateJsonCode]
	)

	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: ItemType,
		drop: item => handleDrop(item),
		hover: (item, monitor) => {
			const containerNode = containerRef.current
			if (containerNode) {
				const mouseY = monitor.getClientOffset()?.y || 0
				const scrollY = window.scrollY || document.documentElement.scrollTop

				let newIndex = formElements.length
				let hovered = null

				for (let i = 0; i < formElements.length; i++) {
					const elementNode = containerNode.children[i]
					if (elementNode) {
						const elementRect = elementNode.getBoundingClientRect()
						const elementTop = elementRect.top + scrollY
						const elementBottom = elementRect.bottom + scrollY

						if (mouseY >= elementTop && mouseY <= elementBottom) {
							hovered = formElements[i]
							newIndex = i
							break
						}
					}
				}

				if (newIndex !== newElementPosition) {
					setNewElementPosition(newIndex)
				}

				if (hovered !== hoveredElement) {
					setHoveredElement(hovered)
				}
			}
		},
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	})

	return (
		<Box
			ref={dropRef}
			sx={{
				border: '1px solid #ccc',
				padding: '16px',
				minHeight: '400px',
				backgroundColor: isOver && canDrop ? '#f0f0f0' : 'transparent',
				transition: 'background-color 0.3s',
			}}
		>
			<div ref={containerRef}>
				{formElements.map((element, index) => (
					<Box
						key={element.id}
						sx={{
							marginBottom: '8px',
							padding: '8px',
							border:
								draggingIndex === index ? '2px dashed #000' : '1px solid #ddd',
							backgroundColor: draggingIndex === index ? '#696969' : '#3d3d3d',
							cursor: 'move',
							transition: 'background-color 0.3s, border 0.3s',
						}}
						draggable
						onDragStart={() => handleDragStart(index)}
						onDragEnd={handleDragEnd}
					>
						{element.type.includes('Layout') ? (
							<LayoutElement
								element={element}
								moveElement={moveElement}
								handleElementChange={handleElementChange}
								handleElementDelete={handleElementDelete}
								onDragStart={() => handleDragStart(index)}
								onDragEnd={handleDragEnd}
								draggingIndex={draggingIndex}
								highlighted={hoveredElement && hoveredElement.id === element.id}
								readOnly={false}
							/>
						) : (
							<FormElement
								element={element}
								index={index}
								moveElement={moveElement}
								handleElementChange={handleElementChange}
								handleElementDelete={handleElementDelete}
								onDragStart={() => handleDragStart(index)}
								onDragEnd={handleDragEnd}
								draggingIndex={draggingIndex}
								highlighted={hoveredElement && hoveredElement.id === element.id}
								readOnly={false}
							/>
						)}
					</Box>
				))}
			</div>
		</Box>
	)
}

export default FormEditor

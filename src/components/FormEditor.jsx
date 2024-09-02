import { Box } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import FormElement from './FormElement'
import ModalFormEditor from './ModalFormEditor'

const ItemType = 'widget'

function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [draggingIndex, setDraggingIndex] = useState(null)
	const [newElementPosition, setNewElementPosition] = useState(null)
	const [selectedElement, setSelectedElement] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
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
			const elementSchema = { type, title: el.label }
			if (el.options && el.options.length) {
				elementSchema.enum = el.options
			}
			if (el.minLength) {
				elementSchema.minLength = el.minLength
			}
			if (el.maxLength) {
				elementSchema.maxLength = el.maxLength
			}
			if (el.pattern) {
				elementSchema.pattern = el.pattern
			}
			if (el.minimum) {
				elementSchema.minimum = el.minimum
			}
			if (el.maximum) {
				elementSchema.maximum = el.maximum
			}
			if (el.multipleOf) {
				elementSchema.multipleOf = el.multipleOf
			}
			if (el.required) {
				elementSchema.required = true
			}
			acc[el.id] = elementSchema
			return acc
		}, {})
		return { type: 'object', properties }
	}

	const convertToUiSchema = elements => ({
		type: 'VerticalLayout',
		elements: elements.map(el => ({
			type: 'Control',
			scope: `#/properties/${el.id}`,
			options: {
				format: el.type === 'checkbox' ? 'checkbox' : el.type,
				enum: el.options,
				minLength: el.minLength,
				maxLength: el.maxLength,
				pattern: el.pattern,
				minimum: el.minimum,
				maximum: el.maximum,
				multipleOf: el.multipleOf,
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
				value: item.defaultValue || '', // Устанавливаем значение по умолчанию, если оно есть
				...item, // Добавляем все свойства виджета
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

	const handleElementDelete = id => {
		const updatedElements = formElements.filter(el => el.id !== id)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const openModal = element => {
		setSelectedElement(element)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const saveElement = data => {
		setFormElements(prevElements =>
			prevElements.map(el =>
				el.id === selectedElement.id ? { ...el, ...data } : el
			)
		)
		updateJsonCode(formElements)
		closeModal()
	}

	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: ItemType,
		drop: item => handleDrop(item),
		hover: (item, monitor) => {
			const containerNode = containerRef.current
			if (containerNode) {
				const containerRect = containerNode.getBoundingClientRect()
				const mouseY = monitor.getClientOffset().y
				const scrollY = window.scrollY || document.documentElement.scrollTop

				let cumulativeHeight = containerRect.top + scrollY
				let newIndex = formElements.length

				for (let i = 0; i < formElements.length; i++) {
					const elementNode = containerNode.children[i]
					if (elementNode) {
						const elementRect = elementNode.getBoundingClientRect()
						const elementHeight = elementRect.height
						const elementTop = elementRect.top + scrollY

						if (mouseY < elementTop + elementHeight / 2) {
							newIndex = i
							break
						}
						cumulativeHeight += elementHeight + 10
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
				height: '460px',
				borderRadius: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				overflowY: 'auto',
				position: 'relative',
				paddingBottom: '120px',
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
					handleElementDelete={handleElementDelete}
					onDragStart={() => handleDragStart(index)}
					onDragEnd={handleDragEnd}
					draggingIndex={draggingIndex}
					highlighted={newElementPosition === index}
					onOpenEditModal={openModal}
				/>
			))}
			{isModalOpen && selectedElement && (
				<ModalFormEditor
					isOpen={isModalOpen}
					onClose={closeModal}
					element={selectedElement}
					onSave={saveElement}
				/>
			)}
		</Box>
	)
}

export default FormEditor

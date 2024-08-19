import { Box, Typography } from '@mui/material'
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
		setNewElementPosition(null) // Сброс позиции после дропа
	}

	const handleDragStart = index => {
		setDraggingIndex(index)
	}

	const handleDragEnd = () => {
		setDraggingIndex(null)
		setNewElementPosition(null)
	}

	const [{ isOver }, dropRef] = useDrop({
		accept: ItemType,
		drop: item => {
			handleDrop(item)
		},
		hover: (item, monitor) => {
			const containerNode = containerRef.current
			if (containerNode) {
				const { top, bottom } = containerNode.getBoundingClientRect()
				const mouseY = monitor.getClientOffset().y

				const itemHeight =
					containerNode.clientHeight / (formElements.length + 1)
				if (mouseY < top + itemHeight / 2) {
					setNewElementPosition(0)
				} else if (mouseY > bottom - itemHeight / 2) {
					setNewElementPosition(formElements.length)
				} else {
					const index = Math.floor((mouseY - top) / itemHeight)
					setNewElementPosition(index)
				}
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
				position: 'relative',
				paddingBottom: '160px', // Space for new elements and dragging space
			}}
		>
			{formElements.map((element, index) => (
				<FormElement
					key={element.id}
					element={element}
					index={index}
					moveElement={moveElement}
					onDragStart={() => handleDragStart(index)}
					onDragEnd={handleDragEnd}
					draggingIndex={draggingIndex}
					highlighted={newElementPosition === index}
				/>
			))}
			{newElementPosition !== null && (
				<Box
					sx={{
						position: 'absolute',
						top: `${
							(newElementPosition * containerRef.current.clientHeight) /
							(formElements.length + 1)
						}px`,
						left: 0,
						width: '100%',
						height: '80px', // Use the height of a typical form element
						backgroundColor: 'background.default',
						border: '1px dashed',
						borderColor: 'primary.main',
						zIndex: 1,
						pointerEvents: 'none',
						transition: 'top 0.2s ease-out',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: 0.5,
					}}
				>
					<Box
						sx={{
							width: '100%',
							height: '100%',
							border: '1px solid',
							borderColor: 'primary.main',
							backgroundColor: 'background.paper',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography variant='body2' color='textSecondary'>
							Drop here
						</Typography>
					</Box>
				</Box>
			)}
		</Box>
	)
}

export default FormEditor

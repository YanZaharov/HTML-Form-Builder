import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import FormElement from './FormElement'

const LayoutElement = React.memo(
	({
		element,
		moveElement,
		handleElementChange,
		handleElementDelete,
		onDragStart,
		onDragEnd,
		draggingIndex,
		highlighted,
		readOnly,
	}) => {
		const [isDragging, setIsDragging] = useState(false)

		useEffect(() => {
			// Обновление состояния при изменении индекса перетаскиваемого элемента
			if (draggingIndex !== null) {
				setIsDragging(draggingIndex === element.id)
			}
		}, [draggingIndex, element.id])

		if (!element || !Array.isArray(element.children)) {
			console.warn(
				`Некорректный элемент или отсутствуют дети: ${JSON.stringify(element)}`
			)
			return null
		}

		const flexDirection =
			element.layoutType === 'HorizontalLayout' ? 'row' : 'column'

		const handleDragStart = e => {
			setIsDragging(true)
			e.dataTransfer.setData('text/plain', element.id)
			onDragStart(e)
		}

		const handleDragEnd = e => {
			setIsDragging(false)
			onDragEnd(e)
		}

		const handleDelete = e => {
			e.stopPropagation()
			handleElementDelete(element.id)
		}

		const handleDrop = e => {
			e.preventDefault()
			const draggedId = e.dataTransfer.getData('text/plain')
			if (draggedId && draggedId !== element.id) {
				moveElement(draggedId, element.id)
			}
		}

		const handleDragOver = e => {
			e.preventDefault()
		}

		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection,
					flexWrap: 'wrap',
					gap: 2,
					padding: 2,
					border: '1px dashed',
					borderColor: highlighted || isDragging ? 'primary.main' : 'divider',
					backgroundColor: isDragging
						? 'action.disabledBackground'
						: 'background.paper',
					overflow: 'auto',
					minHeight: 100,
					position: 'relative',
					opacity: isDragging ? 0.7 : 1,
				}}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				draggable={!readOnly}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				{!readOnly && (
					<Tooltip title='Удалить'>
						<IconButton
							sx={{
								position: 'absolute',
								top: 8,
								right: 8,
								zIndex: 1,
							}}
							onClick={handleDelete}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				)}

				{element.children.map((childElement, idx) => {
					if (!childElement || !childElement.id || !childElement.type) {
						console.warn(
							`Некорректный childElement или отсутствуют id/type: ${JSON.stringify(
								childElement
							)}`
						)
						return null
					}

					const isLayout = childElement.type.includes('Layout')
					const ComponentToRender = isLayout ? LayoutElement : FormElement

					return (
						<ComponentToRender
							key={childElement.id}
							element={childElement}
							moveElement={moveElement}
							handleElementChange={handleElementChange}
							handleElementDelete={handleElementDelete}
							onDragStart={onDragStart}
							onDragEnd={onDragEnd}
							draggingIndex={draggingIndex}
							highlighted={highlighted}
							readOnly={readOnly}
						/>
					)
				})}
			</Box>
		)
	}
)

LayoutElement.propTypes = {
	element: PropTypes.shape({
		id: PropTypes.string.isRequired,
		children: PropTypes.arrayOf(PropTypes.object).isRequired,
		layoutType: PropTypes.string,
	}).isRequired,
	moveElement: PropTypes.func.isRequired,
	handleElementChange: PropTypes.func.isRequired,
	handleElementDelete: PropTypes.func.isRequired,
	onDragStart: PropTypes.func.isRequired,
	onDragEnd: PropTypes.func.isRequired,
	draggingIndex: PropTypes.string,
	highlighted: PropTypes.bool,
	readOnly: PropTypes.bool,
}

export default LayoutElement

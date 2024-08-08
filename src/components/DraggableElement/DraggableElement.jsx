import { useDraggable } from '@dnd-kit/core'
import PropTypes from 'prop-types'

const DraggableElement = ({ id, type, label }) => {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id,
		data: { type },
	})

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className='draggable-element'
		>
			{label}
		</div>
	)
}

DraggableElement.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
}

export default DraggableElement

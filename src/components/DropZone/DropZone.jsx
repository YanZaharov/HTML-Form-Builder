import { useDroppable } from '@dnd-kit/core'
import PropTypes from 'prop-types'

const DropZone = ({ children }) => {
	const { isOver, setNodeRef } = useDroppable({
		id: 'dropzone',
	})

	const style = {
		border: '2px dashed #ccc',
		backgroundColor: isOver ? '#f0f0f0' : 'white',
		padding: '20px',
		minHeight: '200px',
	}

	return (
		<div ref={setNodeRef} style={style}>
			{children}
		</div>
	)
}

DropZone.propTypes = {
	children: PropTypes.node.isRequired,
}

export default DropZone

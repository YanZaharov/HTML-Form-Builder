import PropTypes from 'prop-types'
import DraggableElement from '../DraggableElement/DraggableElement'

const WidgetList = ({ widgets }) => {
	return (
		<div className='widget-list'>
			{widgets.map(widget => (
				<DraggableElement
					key={widget.id}
					id={widget.id}
					type={widget.type}
					label={widget.label}
				/>
			))}
		</div>
	)
}

WidgetList.propTypes = {
	widgets: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
}

export default WidgetList

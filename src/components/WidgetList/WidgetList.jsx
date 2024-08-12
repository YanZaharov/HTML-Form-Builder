import { useDrag } from 'react-dnd'
import './WidgetList.css'

const WidgetItem = ({ type, label }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'widget',
		item: { type, label },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}))

	return (
		<div
			ref={drag}
			className='widget-item'
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			{label}
		</div>
	)
}

function WidgetList() {
	const widgets = [
		{ type: 'input', label: 'Text Input' },
		{ type: 'number', label: 'Number Input' },
		{ type: 'checkbox', label: 'Checkbox' },
		{ type: 'listbox', label: 'Listbox' },
		{ type: 'combobox', label: 'Combobox' },
		{ type: 'radiobuttons', label: 'Radio Buttons' },
	]

	return (
		<div className='widget-list'>
			{widgets.map(widget => (
				<WidgetItem key={widget.type} type={widget.type} label={widget.label} />
			))}
		</div>
	)
}

export default WidgetList

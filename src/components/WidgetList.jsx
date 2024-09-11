import { Box, Typography } from '@mui/material'
import { useDrag } from 'react-dnd'

const WidgetItem = ({ type, label }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'widget',
		item: { type, label },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}))

	return (
		<Box
			ref={drag}
			sx={{
				backgroundColor: '#3e3e3e',
				border: '1px solid #4a4a4a',
				padding: 2,
				borderRadius: 1,
				cursor: 'move',
				opacity: isDragging ? 0.5 : 1,
			}}
		>
			<Typography>{label}</Typography>
		</Box>
	)
}

function WidgetList() {
	const widgets = [
		{ type: 'text', label: 'Text Input' },
		{ type: 'number', label: 'Number Input' },
		{ type: 'checkbox', label: 'Checkbox' },
		{ type: 'listbox', label: 'Listbox' },
		{ type: 'combobox', label: 'Combobox' },
		{ type: 'radiobuttons', label: 'Radio Buttons' },
	]

	return (
		<Box
			sx={{
				backgroundColor: '#2e2e2e',
				border: '1px solid #4a4a4a',
				borderRadius: 1,
				padding: 2,
				height: '460px',
				overflowY: 'auto',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			{widgets.map(widget => (
				<WidgetItem key={widget.type} type={widget.type} label={widget.label} />
			))}
		</Box>
	)
}

export default WidgetList

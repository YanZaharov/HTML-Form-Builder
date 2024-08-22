import { Box, TextareaAutosize } from '@mui/material'

function JSONEditor({ jsonCode, setJsonCode }) {
	const handleJsonChange = e => {
		setJsonCode(e.target.value)
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				backgroundColor: '#2e2e2e',
				color: '#fff',
				border: '1px solid #4a4a4a',
				borderRadius: 1,
				padding: 2,
				boxSizing: 'border-box',
				overflow: 'auto',
			}}
		>
			<TextareaAutosize
				value={jsonCode}
				onChange={handleJsonChange}
				spellCheck='false'
				style={{
					width: '100%',
					backgroundColor: 'transparent',
					color: 'inherit',
					border: 'none',
					resize: 'none',
					fontFamily: 'monospace',
					fontSize: '14px',
					overflowY: 'auto',
				}}
			/>
		</Box>
	)
}

export default JSONEditor

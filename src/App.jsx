import {
	Box,
	createTheme,
	CssBaseline,
	Paper,
	ThemeProvider,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FormActions from './components/FormActions'
import FormEditor from './components/FormEditor'
import FormPreview from './components/FormPreview'
import JSONEditor from './components/JSONEditor'
import WidgetList from './components/WidgetList'

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		fontFamily: 'Arial, sans-serif',
	},
})

function App() {
	const [formElements, setFormElements] = useState([])
	const [jsonCode, setJsonCode] = useState('{}')

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<DndProvider backend={HTML5Backend}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						padding: 2,
					}}
				>
					{/* Верхний блок */}
					<Box
						sx={{
							display: 'flex',
							height: '75vh', // высота верхнего блока 75vh
							gap: 2,
						}}
					>
						{/* Виджет лист */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden', // убираем внешний скролл
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e', // немного светлее фон
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Widget List
							</Typography>{' '}
							{/* Отступ снизу для лейбла */}
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)', // высота для внутреннего скролла
									overflowY: 'auto',
								}}
							>
								<WidgetList />
							</Box>
						</Paper>

						{/* Редактор формы */}
						<Paper
							elevation={3}
							sx={{
								flex: 1,
								overflow: 'hidden', // убираем внешний скролл
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e', // немного светлее фон
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Editor
							</Typography>{' '}
							{/* Отступ снизу для лейбла */}
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)', // высота для внутреннего скролла
									overflowY: 'auto',
								}}
							>
								<FormEditor
									formElements={formElements}
									setFormElements={setFormElements}
									setJsonCode={setJsonCode}
								/>
							</Box>
						</Paper>
					</Box>

					{/* Нижний блок */}
					<Box
						sx={{
							display: 'flex',
							height: '75vh', // высота нижнего блока 75vh
							gap: 2,
						}}
					>
						{/* JSON Editor */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden', // убираем внешний скролл
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e', // немного светлее фон
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								JSON Editor
							</Typography>{' '}
							{/* Отступ снизу для лейбла */}
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)', // высота для внутреннего скролла
									overflowY: 'auto',
								}}
							>
								<JSONEditor jsonCode={jsonCode} setJsonCode={setJsonCode} />
							</Box>
						</Paper>

						{/* Предпросмотр формы */}
						<Paper
							elevation={3}
							sx={{
								flex: 1,
								overflow: 'hidden', // убираем внешний скролл
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e', // немного светлее фон
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Preview
							</Typography>{' '}
							{/* Отступ снизу для лейбла */}
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)', // высота для внутреннего скролла
									overflowY: 'auto',
								}}
							>
								<FormPreview formElements={formElements} />
							</Box>
						</Paper>
					</Box>

					{/* Кнопки */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mt: 2,
						}}
					>
						<FormActions
							formElements={formElements}
							setFormElements={setFormElements}
							setJsonCode={setJsonCode}
						/>
					</Box>
				</Box>
			</DndProvider>
		</ThemeProvider>
	)
}

export default App

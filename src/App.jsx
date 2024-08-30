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
import ModalFormEditor from './components/ModalFormEditor'
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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedElement, setSelectedElement] = useState(null)

	const handleOpenModal = element => {
		setSelectedElement(element)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedElement(null)
	}

	const handleSaveChanges = updatedElement => {
		setFormElements(prevElements =>
			prevElements.map(el =>
				el.id === updatedElement.id ? updatedElement : el
			)
		)
		handleCloseModal()
	}

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
							height: '75vh',
							gap: 2,
						}}
					>
						{/* Виджет лист */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Widget List
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)',
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
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Editor
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)',
									overflowY: 'auto',
								}}
							>
								<FormEditor
									formElements={formElements}
									setFormElements={setFormElements}
									setJsonCode={setJsonCode}
									handleOpenModal={handleOpenModal}
								/>
							</Box>
						</Paper>
					</Box>

					{/* Нижний блок */}
					<Box
						sx={{
							display: 'flex',
							height: '75vh',
							gap: 2,
						}}
					>
						{/* JSON Editor */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								JSON Schema
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)',
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
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Preview
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(75vh - 16px)',
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

					{/* Модальное окно для редактирования элемента */}
					{isModalOpen && (
						<ModalFormEditor
							isOpen={isModalOpen}
							onClose={handleCloseModal}
							widget={selectedElement}
							onSave={handleSaveChanges}
						/>
					)}
				</Box>
			</DndProvider>
		</ThemeProvider>
	)
}

export default App

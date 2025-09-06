import css from './NoteForm.module.css'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '../../lib/api'

interface NoteFormProps {
    onClose: () => void
}

interface initialValuesFormProps {
    title: string
    content: string
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'
}

export default function NoteForm({ onClose }: NoteFormProps) {
    const NoteFormSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .min(3, 'Title must be at least 3 characters')
            .max(50, 'Title is too long'),
        content: Yup.string().max(500, 'Description is too long'),
        tag: Yup.string().oneOf([
            'Todo',
            'Work',
            'Personal',
            'Meeting',
            'Shopping',
        ]),
    })
    const initialValuesForm: initialValuesFormProps = {
        title: '',
        content: '',
        tag: 'Todo',
    }
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            onClose()
        },
    })
    const handleSubmit = (
        values: initialValuesFormProps,
        actions: FormikHelpers<initialValuesFormProps>
    ) => {
        mutate({
            title: values.title,
            content: values.content,
            tag: values.tag,
        })
        actions.resetForm()
    }
    return (
        <Formik
            initialValues={initialValuesForm}
            onSubmit={handleSubmit}
            validationSchema={NoteFormSchema}
        >
            <Form>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field
                        id="title"
                        type="text"
                        name="title"
                        className={css.input}
                    />
                    <ErrorMessage
                        component="span"
                        name="title"
                        className={css.error}
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage
                        component="span"
                        name="content"
                        className={css.error}
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field
                        as="select"
                        id="tag"
                        name="tag"
                        className={css.select}
                    >
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage
                        component="span"
                        name="tag"
                        className={css.error}
                    />
                </div>

                <div className={css.actions}>
                    <button
                        type="button"
                        className={css.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={false}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    )
}

'use client'
import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import css from './Notes.module.css'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import Modal from '@/components/Modal/Modal'
import { fetchNotes } from '@/lib/api'
import { useDebounce } from 'use-debounce'
import NoteForm from '@/components/NoteForm/NoteForm'

interface NotesClientProps {
    tag?: string
}

export default function NotesClient({ tag }: NotesClientProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [text, setText] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    function openModal() {
        setIsModalOpen(true)
    }
    function closeModal() {
        setIsModalOpen(false)
    }

    const [debouncedSearchedQuery] = useDebounce(text, 500)
    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes', currentPage, debouncedSearchedQuery, tag],
        queryFn: () =>
            fetchNotes(
                currentPage,
                debouncedSearchedQuery || undefined,
                tag || undefined
            ),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    })
    const handleChange = (value: string) => {
        setCurrentPage(1)
        setText(value)
    }
    const totalPages = data?.totalPages || 0
    return (
        <>
            <div className={css.app}>
                <header className={css.toolbar}>
                    {<SearchBox onChange={handleChange} value={text} />}
                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                    {
                        <button className={css.button} onClick={openModal}>
                            Create note +
                        </button>
                    }
                </header>
                {isError && <p>Something went wrong...</p>}
                {isLoading && <p>Loading...</p>}
                {data && data.notes.length !== 0 && (
                    <NoteList notes={data.notes} />
                )}
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <NoteForm onClose={closeModal} />
                    </Modal>
                )}
            </div>
        </>
    )
}

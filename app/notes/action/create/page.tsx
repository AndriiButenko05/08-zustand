import CreateNote from './CreateNote.client'
import css from './page.module.css'

export function generateMetadata() {
    return {
        title: `Create Note`,
        description: `Create New Note`,
        openGraph: {
            title: `Create Note`,
            description: `Create New Note`,
            url: 'https://08-zustand-ten-ochre.vercel.app/notes/action/create',
            images: [
                {
                    url: 'https://placehold.co/1200x630',
                    width: 1200,
                    height: 630,
                    alt: 'NoteHub',
                },
            ],
        },
    }
}

export default function page() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                {<CreateNote></CreateNote>}
            </div>
        </main>
    )
}
